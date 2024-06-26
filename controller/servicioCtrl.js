const asyncHandler = require('express-async-handler');
const Servicio = require('../models/servicioModel');
const Attendance = require('../models/attendanceModel');
const mongoose = require('mongoose');

// @desc    Obtener todos los servicios
// @route   GET /api/servicios
// @access  Público
const getServicios = asyncHandler(async (req, res) => {
  try {
    const services = await Servicio.find().lean();
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const attendances = await Attendance.find({ servicio: service._id })
        .populate({ path: 'trabajador' })
        .select('horaEntrada horaSalida horaAlmuerzo trabajador');
      const attendanceDetails = [];
      let totalHoursWorked = 0;
      for (let j = 0; j < attendances.length; j++) {
        const attendance = attendances[j];
        let hoursWorked = 0;
        if (attendance.horaSalida) {
          hoursWorked = (attendance.horaSalida - attendance.horaEntrada) / (1000 * 60 * 60);
          if (attendance.horaAlmuerzo !== undefined ? attendance.horaAlmuerzo : true) {
            hoursWorked -= 1;
          }
          if (hoursWorked < 0) {
            hoursWorked = 0;
          }
          totalHoursWorked += hoursWorked;
        }
        const attendanceDate = attendance.horaEntrada.toDateString();
        let trabajadorNombre = "Trabajador no asignado";
        if (attendance.trabajador) {
          trabajadorNombre = attendance.trabajador.firstname + " " + attendance.trabajador.lasttname;
        }
        attendanceDetails.push({
          trabajador: trabajadorNombre,
          fecha: attendanceDate,
          horasTrabajadas: hoursWorked
        });
      }
      services[i].asistenciaTrabajo = attendanceDetails;
      services[i].totalHorasTrabajadas = totalHoursWorked;

      // Manejar el caso donde no hay tareas asignadas
      if (services[i].tareas) {
        for (let k = 0; k < services[i].tareas.length; k++) {
          const tarea = services[i].tareas[k];
          const tareaAttendances = await Attendance.find({ _id: { $in: tarea.asistenciaTrabajo }, servicio: service._id });
          tarea.totalHorasHombre = tareaAttendances.reduce((sum, doc) => sum + doc.duracionJornada, 0);
        }
      }
    }
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// @desc    Obtener un servicio por su ID
// @route   GET /api/servicios/:id
// @access  Público
const getServicioById = asyncHandler(async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id)
      .populate({
        path: 'supervisoresAsignados',
        select: 'firstname lasttname',
        model: 'User'
      })
      .lean();

    if (!servicio) {
      res.status(404);
      throw new Error('Servicio no encontrado');
    }

    const attendances = await Attendance.find({ servicio: servicio._id })
      .populate({ path: 'trabajador', select: 'firstname lasttname position' })
      .select('horaEntrada horaSalida horaAlmuerzo trabajador');
    
    const attendanceDetails = attendances.map(attendance => {
      let hoursWorked = 0;
      if (attendance.horaSalida) {
        hoursWorked = (attendance.horaSalida - attendance.horaEntrada) / (1000 * 60 * 60);
        if (attendance.horaAlmuerzo !== undefined ? attendance.horaAlmuerzo : true) {
          hoursWorked -= 1;
        }
        if (hoursWorked < 0) {
          hoursWorked = 0;
        }
      }
      return {
        trabajador: attendance.trabajador ? `${attendance.trabajador.firstname} ${attendance.trabajador.lasttname}` : "Trabajador no asignado",
        position: attendance.trabajador ? attendance.trabajador.position : "N/A",
        fecha: attendance.horaEntrada.toDateString(),
        horaEntrada: attendance.horaEntrada,
        horaSalida: attendance.horaSalida,
        horasTrabajadas: hoursWorked
      };
    });

    const totalHoursWorked = attendanceDetails.reduce((sum, attendance) => sum + attendance.horasTrabajadas, 0);
    servicio.asistenciaTrabajo = attendanceDetails;
    servicio.totalHorasTrabajadas = totalHoursWorked;

    if (servicio.tareas) {
      for (let tarea of servicio.tareas) {
        const tareaAttendances = await Attendance.find({ _id: { $in: tarea.asistenciaTrabajo }, servicio: servicio._id });
        tarea.totalHorasHombre = tareaAttendances.reduce((sum, doc) => sum + doc.duracionJornada, 0);
      }
    }

    res.status(200).json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// @desc    Crear un nuevo servicio
// @route   POST /api/servicios
// @access  Privado
const createServicio = asyncHandler(async (req, res) => {
  const { nombre, descripcion, costoEstimado, horasHombreProyectadas, caracteristicas, fechaInicio, fechaFin, numeroOrdenCompra, fechaAprobacionOrdenCompra, nombreCliente, ubicacion, supervisoresAsignados } = req.body;
  if (!nombre || !descripcion || !costoEstimado || !caracteristicas || !fechaInicio || !horasHombreProyectadas || !supervisoresAsignados) {
    res.status(400);
    throw new Error('Por favor, proporcione nombre, descripcion, costoEstimado, horasHombreProyectadas, caracteristicas, supervisoresAsignados y fechaInicio');
  }
  const servicio = await Servicio.create({
    nombre,
    descripcion,
    costoEstimado,
    horasHombreProyectadas,
    caracteristicas,
    fechaInicio,
    fechaFin,
    numeroOrdenCompra,
    fechaAprobacionOrdenCompra,
    nombreCliente,
    ubicacion,
    registradoPor: req.user._id,
    supervisoresAsignados
  });
  res.status(201).json(servicio);
});

// @desc    Actualizar un servicio
// @route   PUT /api/servicios/:id
// @access  Privado
const updateServicio = asyncHandler(async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    const {
      nombre,
      descripcion,
      costoEstimado,
      horasHombreProyectadas,
      caracteristicas,
      fechaInicio,
      fechaFin,
      numeroOrdenCompra,
      fechaAprobacionOrdenCompra,
      nombreCliente,
      ubicacion,
      tareas,
      supervisoresAsignados,
      estado
    } = req.body;

    const camposActualizados = {
      nombre,
      descripcion,
      costoEstimado,
      horasHombreProyectadas,
      fechaInicio,
      fechaFin,
      numeroOrdenCompra,
      fechaAprobacionOrdenCompra,
      nombreCliente,
      ubicacion,
      supervisoresAsignados,
      estado
    };

    for (const key in camposActualizados) {
      if (camposActualizados[key] !== undefined) {
        servicio[key] = camposActualizados[key];
      }
    }

    if (tareas) {
      servicio.tareas = tareas.map(t => ({
        _id: t._id || new mongoose.Types.ObjectId(),
        ...t
      }));
    }

    if (caracteristicas) {
      servicio.caracteristicas = caracteristicas;
    }

    await servicio.save();
    res.status(200).json(servicio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// @desc    Eliminar un servicio
// @route   DELETE /api/servicios/:id
// @access  Privado
const deleteServicio = asyncHandler(async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndDelete(req.params.id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servicio' });
  }
});

const actualizarServicios = asyncHandler(async (req, res) => {
  try {
    const { horasHombreProyectadas } = req.body;
    const { supervisorId } = req.params;

    if (!supervisorId) {
      return res.status(400).json({ message: 'Supervisor ID es requerido.' });
    }

    const supervisorObjectId = new mongoose.Types.ObjectId(supervisorId);

    // Verificar si el supervisorId corresponde a un usuario existente
    const supervisor = await User.findById(supervisorObjectId);
    if (!supervisor) {
      return res.status(400).json({ message: 'El supervisor ID proporcionado no corresponde a un usuario existente.' });
    }

    const servicios = await Servicio.find();

    for (let servicio of servicios) {
      if (!servicio.supervisoresAsignados.includes(supervisorObjectId)) {
        servicio.supervisoresAsignados.push(supervisorObjectId);
      }

      if (horasHombreProyectadas !== undefined) {
        servicio.horasHombreProyectadas = horasHombreProyectadas;
      }

      await servicio.save();
    }

    res.status(200).json({ message: 'Actualización de servicios completada exitosamente.' });
  } catch (error) {
    console.error(`Error actualizando los servicios: ${error.message}`);
    res.status(500).json({ message: 'Error al actualizar los servicios.', error });
  }
});

module.exports = { getServicios, getServicioById, createServicio, updateServicio, deleteServicio, actualizarServicios };
