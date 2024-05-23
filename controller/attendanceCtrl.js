const Attendance = require('../models/attendanceModel');
const asyncHandler=require('express-async-handler')
const Servicio = require('../models/servicioModel')
const mongoose = require('mongoose');
const attendanceModel = require('../models/attendanceModel');



// Crear nueva asistencia
const createAttendance = asyncHandler(async (req, res) => {
  try {
    const { trabajador, servicio, horaEntrada, horaSalida } = req.body;

    // Crear la nueva asistencia
    const attendance = new Attendance({ 
      trabajador,
      servicio,
      horaEntrada,
      horaSalida: horaSalida || null,
      registradoPor: req.user._id
    });
    // Guardar la asistencia
    await attendance.save();
    const horaAlmuerzo = attendance.horaAlmuerzo
    // Calcular la duración de la jornada si hay hora de salida y se descuenta la hora de almuerzo
    if (horaSalida ) {
      let nuevaDuracion = (new Date(horaSalida) - new Date(horaEntrada)) / 1000 / 60; // Duración en minutos
      // Restar una hora si se descuenta el almuerzo
      attendance.duracionJornada = nuevaDuracion;
      await attendance.save();

      // Actualizar el servicio con la nueva asistencia y las horas trabajadas
      await Servicio.findByIdAndUpdate(servicio, {
        $push: { asistenciaTrabajo: attendance._id },
        $inc: { totalHorasTrabajadas: nuevaDuracion }
      });
    } else {
      // Solo agregar la asistencia sin calcular horas trabajadas si no hay hora de salida
      await Servicio.findByIdAndUpdate(servicio, {
        $push: { asistenciaTrabajo: attendance._id }
      });
    }

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const updateAttendance = asyncHandler(async (req, res) => {
  try {
    const { horaEntrada, horaSalida, horaAlmuerzo } = req.body;

    // Encontrar la asistencia actual
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }

    // Si la asistencia no tiene hora de salida y no se proporcionan hora de entrada y salida, no se permite modificar la hora de almuerzo
    if (!attendance.horaSalida && !horaEntrada && !horaSalida && horaAlmuerzo !== undefined) {
      return res.status(400).json({ message: 'No se puede modificar la hora de almuerzo si no se ha registrado la hora de salida' });
    }

    // Calcular la duración anterior y la nueva duración si la hora de salida está presente
    const duracionAnterior = attendance.duracionJornada;
    let nuevaDuracion = duracionAnterior;

    if (horaSalida !== undefined || attendance.horaSalida) {
      // Si la hora de salida está definida, se usa la horaSalida proporcionada, de lo contrario, se mantiene la horaSalida actual
      const nuevaHoraSalida = horaSalida || attendance.horaSalida;
      const horaAlmuerzoMinutes = horaAlmuerzo ? 60 : 0;
      nuevaDuracion = ((new Date(nuevaHoraSalida) - new Date(horaEntrada || attendance.horaEntrada)) / 1000 / 60) - horaAlmuerzoMinutes; // Duración en minutos
    }

    // Actualizar la asistencia
    attendance.horaEntrada = horaEntrada || attendance.horaEntrada;
    attendance.horaSalida = horaSalida !== undefined ? horaSalida : attendance.horaSalida;
    attendance.horaAlmuerzo = horaAlmuerzo !== undefined ? horaAlmuerzo : attendance.horaAlmuerzo;
    attendance.duracionJornada = nuevaDuracion;
    await attendance.save();

    if (horaSalida !== undefined) {
      // Calcular la diferencia en la duración de la jornada
      const difference = nuevaDuracion - duracionAnterior;
      // Actualizar el servicio con la nueva duración de la jornada
      await Servicio.findByIdAndUpdate(attendance.servicio, {
        $inc: { totalHorasTrabajadas: difference }
      });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getAttendances = asyncHandler(async (req, res) => {
  try {
    const { date, serviceId, workerId, startDate, endDate } = req.query;

    let filter = {};

    // Filtrar por fecha específica
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      filter.horaEntrada = {
        $gte: startOfDay,
        $lt: endOfDay
      };
    }

    // Filtrar por servicio
    if (serviceId) {
      if (mongoose.Types.ObjectId.isValid(serviceId)) {
        filter.servicio = new mongoose.Types.ObjectId(serviceId);
      } else {
        return res.status(400).json({ error: 'Invalid serviceId' });
      }
    }

    // Filtrar por trabajador
    if (workerId) {
      if (mongoose.Types.ObjectId.isValid(workerId)) {
        filter.trabajador = new mongoose.Types.ObjectId(workerId);
      } else {
        return res.status(400).json({ error: 'Invalid workerId' });
      }
    }

    // Filtrar entre dos fechas
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);

      filter.horaEntrada = {
        $gte: start,
        $lt: end
      };
    }

    const attendances = await Attendance.find(filter).populate('trabajador servicio registradoPor');
    res.json(attendances);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
  

  const getAttendanceById = asyncHandler(async (req, res) => {
    const attendance = await Attendance.findById(req.params.id).populate('trabajador servicio registradoPor');
    if (attendance) {
      res.json(attendance);
    } else {
      res.status(404).json({ message: 'Asistencia no encontrada' });
    }
  });



  const deleteAttendance = asyncHandler(async (req, res) => {
    try {
      const attendance = await Attendance.findById(req.params.id);
      if (!attendance) {
        return res.status(404).json({ message: 'Asistencia no encontrada' });
      }
  
      // Calcular la duración de la jornada
      const duracionJornada = attendance.duracionJornada;
  
      // Eliminar la asistencia
      await Attendance.findByIdAndDelete(req.params.id);
  
      // Actualizar el servicio
      await Servicio.findByIdAndUpdate(attendance.servicio, {
        $pull: { asistenciaTrabajo: attendance._id },
        $inc: { totalHorasTrabajadas: -duracionJornada }
      });
  
      res.status(200).json({ message: 'Asistencia eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  module.exports ={
    createAttendance,
    updateAttendance,
    getAttendanceById,
    getAttendances,
    deleteAttendance
  }