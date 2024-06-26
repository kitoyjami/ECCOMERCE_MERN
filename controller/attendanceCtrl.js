const Attendance = require('../models/attendanceModel');
const asyncHandler = require('express-async-handler');
const Servicio = require('../models/servicioModel');
const mongoose = require('mongoose');

// Crear nueva asistencia
const createAttendance = asyncHandler(async (req, res) => {
  try {
    const { trabajador, servicio, tarea, horaEntrada, horaSalida, notas } = req.body;

    // Crear la nueva asistencia
    const attendance = new Attendance({
      trabajador,
      servicio,
      tarea,
      horaEntrada,
      horaSalida: horaSalida || null,
      registradoPor: req.user._id,
      notas: notas || ''
    });

    // Guardar la asistencia
    await attendance.save();

    // Calcular la duración de la jornada si hay hora de salida
    if (horaSalida) {
      let nuevaDuracion = (new Date(horaSalida) - new Date(horaEntrada)) / 1000 / 60; // Duración en minutos
      // Restar una hora si se descuenta el almuerzo
      if (attendance.horaAlmuerzo) {
        nuevaDuracion -= 60;
      }
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

// Actualizar asistencia existente
const updateAttendance = asyncHandler(async (req, res) => {
  try {
    const allowedFields = [
      'trabajador',
      'servicio',
      'tarea',
      'horaEntrada',
      'horaSalida',
      'ubicacionEntrada',
      'ubicacionSalida',
      'estado',
      'aprobado',
      'notas',
      'horaAlmuerzo'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body.hasOwnProperty(field)) {
        updates[field] = req.body[field];
      }
    }

    const { id } = req.params;

    // Encontrar la asistencia actual
    const attendance = await Attendance.findById(id);
    let bandera1 = attendance.tarea
    if (!attendance) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }

    // Si se intenta modificar la hora de almuerzo sin registrar la hora de salida, retornar error
    if (updates.hasOwnProperty('horaAlmuerzo') && !attendance.horaSalida && !updates.horaSalida) {
      return res.status(400).json({ message: 'No se puede modificar la hora de almuerzo si no se ha registrado la hora de salida' });
    }

    // Calcular la duración anterior
    const duracionAnterior = attendance.duracionJornada;
    let nuevaDuracion = duracionAnterior;

    // Determinar si se debe descontar una hora de almuerzo
    const horaAlmuerzoActual = updates.horaAlmuerzo !== undefined ? updates.horaAlmuerzo : attendance.horaAlmuerzo;
    const horaAlmuerzoMinutes = horaAlmuerzoActual ? 60 : 0;

    // Calcular la nueva duración si la hora de salida está presente o fue enviada
    if (updates.horaSalida !== undefined || attendance.horaSalida) {
      const finalHoraSalida = updates.horaSalida || attendance.horaSalida;
      nuevaDuracion = ((new Date(finalHoraSalida) - new Date(updates.horaEntrada || attendance.horaEntrada)) / 1000 / 60) - horaAlmuerzoMinutes; // Duración en minutos
    }

    // Actualizar solo los campos proporcionados en el request
    for (let key in updates) {
      attendance[key] = updates[key];
    }
    attendance.duracionJornada = nuevaDuracion;

    // Guardar la asistencia actualizada
    await attendance.save();

    // Si se proporcionó una hora de salida, actualizar el total de horas trabajadas en el servicio
    if (updates.horaSalida !== undefined || attendance.horaSalida) {
      const difference = nuevaDuracion - duracionAnterior;
      await Servicio.findByIdAndUpdate(attendance.servicio, {
        $inc: { totalHorasTrabajadas: difference }
      });
    }


    // Nueva funcionalidad: Si se proporcionó una tarea, actualizar el campo asistenciaTrabajo de la tarea
    if (updates.tarea) {
      console.log("Tarea proporcionada:", updates.tarea, "tarea anterior:", bandera1);

      // Si la tarea cambió, eliminar de la tarea anterior y agregar a la nueva
      if (bandera1 && bandera1.toString() !== updates.tarea) {
        console.log("Tarea cambiada de", bandera1, "a", updates.tarea);

        // Eliminar de la tarea anterior
        const oldTask = await Servicio.findOneAndUpdate(
          { "_id": attendance.servicio, "tareas._id": bandera1 },
          { $pull: { "tareas.$.asistenciaTrabajo": attendance._id } }
        );
        console.log("Eliminado de la tarea anterior:", oldTask);

        // Agregar a la nueva tarea
        const newTaskUpdate = await Servicio.findOneAndUpdate(
          { "_id": attendance.servicio, "tareas._id": updates.tarea },
          { $addToSet: { "tareas.$.asistenciaTrabajo": attendance._id } },
          { new: true } // Asegurarse de obtener el documento actualizado
        );
        console.log("Agregado a la nueva tarea:", newTaskUpdate);
      } else if (!bandera1) {
        console.log("No había tarea antes, agregando a la nueva tarea");

        // Si no había tarea antes, simplemente agregar a la nueva tarea
        const newTaskAddition = await Servicio.findOneAndUpdate(
          { "_id": attendance.servicio, "tareas._id": updates.tarea },
          { $addToSet: { "tareas.$.asistenciaTrabajo": attendance._id } },
          { new: true } // Asegurarse de obtener el documento actualizado
        );
        console.log("Agregado a la nueva tarea:", newTaskAddition);
      }
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
    let sortOption = {};

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

    // Filtrar entre dos fechas y ordenarlas
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);

      filter.horaEntrada = {
        $gte: start,
        $lt: end
      };

      // Ordenar por horaEntrada ascendente (1 para ascendente, -1 para descendente)
      sortOption.horaEntrada = 1;
    }

    let attendances = await Attendance.find(filter)
    .populate('trabajador servicio registradoPor')
    .sort(sortOption);

  // Popular manualmente el campo `tarea`
  for (let attendance of attendances) {
    if (attendance.tarea) {
      const servicio = await Servicio.findById(attendance.servicio);
      if (servicio) {
        const tarea = servicio.tareas.id(attendance.tarea);
        attendance._doc.tarea = tarea; // Asignar la tarea al campo tarea en attendance
      }
    }
  }

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

     // Actualizar la tarea dentro del servicio
     if (attendance.tarea) {
      await Servicio.findOneAndUpdate(
        { "_id": attendance.servicio, "tareas._id": attendance.tarea },
        { $pull: { "tareas.$.asistenciaTrabajo": attendance._id } }
      );
    }

    res.status(200).json({ message: 'Asistencia eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const actualizarAsistencias = asyncHandler(async (req, res) => {
  try {
    const updates = {
      $set: {
        tarea: null
      }
    };

    const result = await Attendance.updateMany(
      {},
      updates,
      { upsert: false, multi: true }
    );

    res.status(200).json({ message: 'Actualización de asistencias completada exitosamente.', result });
  } catch (error) {
    console.error(`Error actualizando las asistencias: ${error.message}`);
    res.status(500).json({ message: 'Error al actualizar las asistencias.', error });
  }
});

module.exports = {
  createAttendance,
  updateAttendance,
  getAttendanceById,
  getAttendances,
  deleteAttendance,
  actualizarAsistencias
};
