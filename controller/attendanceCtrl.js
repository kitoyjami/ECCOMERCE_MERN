const Attendance = require('../models/attendanceModel');
const asyncHandler=require('express-async-handler')
const Servicio = require('../models/servicioModel')


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
    console.log(servicio)
    // Guardar la asistencia
    await attendance.save();

    if (horaSalida) {
      // Calcular la duración de la jornada
      const duracionJornada = (new Date(horaSalida) - new Date(horaEntrada)) / 1000 / 60; // Duración en minutos

      // Actualizar el servicio con la nueva asistencia
      await Servicio.findByIdAndUpdate(servicio, {
        $push: { asistenciaTrabajo: attendance._id },
        $inc: { totalHorasTrabajadas: duracionJornada }
      });
    } else {
      // Solo agregar la asistencia sin calcular horas trabajadas
      await Servicio.findByIdAndUpdate(servicio, {
        $push: { asistenciaTrabajo: attendance._id }
      });
    }

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Actualizar asistencia
const updateAttendance = asyncHandler(async (req, res) => {
  try {
    const { horaEntrada, horaSalida } = req.body;

    // Encontrar la asistencia actual
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }

    // Calcular la duración anterior y la nueva duración si la hora de salida está presente
    const duracionAnterior = attendance.duracionJornada;
    let nuevaDuracion = duracionAnterior;

    if (horaSalida) {
      nuevaDuracion = (new Date(horaSalida) - new Date(horaEntrada || attendance.horaEntrada)) / 1000 / 60; // Duración en minutos
    }

    // Actualizar la asistencia
    attendance.horaEntrada = horaEntrada || attendance.horaEntrada;
    attendance.horaSalida = horaSalida || attendance.horaSalida;
    attendance.duracionJornada = nuevaDuracion;
    await attendance.save();

    if (horaSalida) {
      // Actualizar el servicio con la nueva duración de la jornada
      const difference = nuevaDuracion - duracionAnterior;
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
    const attendances = await Attendance.find().populate('trabajador servicio registradoPor');
    res.json(attendances);
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
    await attendance.remove();

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