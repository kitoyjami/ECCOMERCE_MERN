const asyncHandler = require('express-async-handler');
const Servicio = require('../models/servicioModel');
const Attendance =require('../models/attendanceModel')

// @desc    Obtener todos los servicios
// @route   GET /api/servicios
// @access  Público


/* const getServicios = asyncHandler(async (req, res) => {
  try {
    // Recuperar todos los servicios
    const services = await Servicio.find();

    // Iterar sobre cada servicio y obtener los detalles de las asistencias
    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      // Recuperar todas las asistencias asociadas a este servicio
      const attendances = await Attendance.find({ servicio: service._id }).populate('trabajador').select('horaEntrada horaSalida');

      // Crear un array para almacenar los detalles de la asistencia
      const attendanceDetails = [];

      // Calcular la suma de las horas trabajadas de todas las asistencias
      let totalHoursWorked = 0;
      for (let j = 0; j < attendances.length; j++) {
        const attendance = attendances[j];
        const hoursWorked = (attendance.horaSalida - attendance.horaEntrada) / (1000 * 60 * 60); // Convertir a horas
        totalHoursWorked += hoursWorked;
        const attendanceDate = attendance.horaEntrada.toDateString();
        attendanceDetails.push({ trabajador: attendance.trabajador.name, fecha: attendanceDate, horasTrabajadas: hoursWorked });
      }

      // Agregar los detalles de la asistencia y el total de horas trabajadas al objeto de servicio
      services[i].asistenciaTrabajo = attendanceDetails;
      console.log("hola ", attendanceDetails.trabajador)
      services[i].totalHorasTrabajadas = totalHoursWorked;
    }
   
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}); */

/* const getServicios = asyncHandler(async (req, res) => {
  try {
    // Recuperar todos los servicios
    const services = await Servicio.find();

    // Iterar sobre cada servicio y obtener los detalles de las asistencias
    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      // Recuperar todas las asistencias asociadas a este servicio
      const attendances = await Attendance.find({ servicio: service._id }).populate({ path: 'trabajador', select: 'name' }).select('horaEntrada horaSalida trabajador');

      // Crear un array para almacenar los detalles de la asistencia
      const attendanceDetails = [];

      // Calcular la suma de las horas trabajadas de todas las asistencias
      let totalHoursWorked = 0;
      for (let j = 0; j < attendances.length; j++) {
        const attendance = attendances[j];
        const hoursWorked = (attendance.horaSalida - attendance.horaEntrada) / (1000 * 60 * 60); // Convertir a horas
        totalHoursWorked += hoursWorked;
        const attendanceDate = attendance.horaEntrada.toDateString();
        attendanceDetails.push({ trabajador: attendance.trabajador.name, fecha: attendanceDate, horasTrabajadas: hoursWorked });
      }

      // Agregar los detalles de la asistencia y el total de horas trabajadas al objeto de servicio
      services[i].asistenciaTrabajo = attendanceDetails;
      console.log("Hola", attendanceDetails)
      services[i].totalHorasTrabajadas = totalHoursWorked;
    }
   
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
 */
/* const getServicios = asyncHandler(async (req, res) => {
  try {
    // Recuperar todos los servicios
    const services = await Servicio.find();

    // Iterar sobre cada servicio y obtener los detalles de las asistencias
    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      // Recuperar todas las asistencias asociadas a este servicio
      const attendances = await Attendance.find({ servicio: service._id })
        .populate({
          path: 'trabajador',
          select: 'firstname lasttname'
        })
        .select('horaEntrada horaSalida trabajador');

      // Crear un array para almacenar los detalles de la asistencia
      const attendanceDetails = [];

      // Calcular la suma de las horas trabajadas de todas las asistencias
      let totalHoursWorked = 0;
      for (let j = 0; j < attendances.length; j++) {
        const attendance = attendances[j];
        const hoursWorked = (attendance.horaSalida - attendance.horaEntrada) / (1000 * 60 * 60); // Convertir a horas
        totalHoursWorked += hoursWorked;
        const attendanceDate = attendance.horaEntrada.toDateString();
        attendanceDetails.push({
          trabajador: `${attendance.trabajador.firstname} ${attendance.trabajador.lastname}`,
          fecha: attendanceDate,
          horasTrabajadas: hoursWorked
        });
      }
      console.log(attendances.trabajador)
      // Agregar los detalles de la asistencia y el total de horas trabajadas al objeto de servicio
      services[i].asistenciaTrabajo = attendanceDetails;
      services[i].totalHorasTrabajadas = totalHoursWorked;
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}); */


const getServicios = asyncHandler(async (req, res) => {
  try {
    // Recuperar todos los servicios
    const services = await Servicio.find().lean();

    // Iterar sobre cada servicio y obtener los detalles de las asistencias
    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      // Recuperar todas las asistencias asociadas a este servicio
      const attendances = await Attendance.find({ servicio: service._id })
        .populate({
          path: 'trabajador',
        })
        .select('horaEntrada horaSalida trabajador');

      // Crear un array para almacenar los detalles de la asistencia
      const attendanceDetails = [];

      // Calcular la suma de las horas trabajadas de todas las asistencias
      let totalHoursWorked = 0;
      for (let j = 0; j < attendances.length; j++) {
        const attendance = attendances[j];
        const hoursWorked = (attendance.horaSalida - attendance.horaEntrada) / (1000 * 60 * 60); // Convertir a horas
        totalHoursWorked += hoursWorked;
        const attendanceDate = attendance.horaEntrada.toDateString();

        // Verificar si el trabajador existe antes de acceder a sus propiedades
        let trabajadorNombre = "Trabajador no asignado";
        if (attendance.trabajador && attendance.trabajador.length > 0) {
          trabajadorNombre = attendance.trabajador[0].firstname + " " + attendance.trabajador[0].lastname;
        }

        attendanceDetails.push({
          trabajador: trabajadorNombre, // Incluir toda la información del trabajador
          fecha: attendanceDate,
          horasTrabajadas: hoursWorked
        });
      }

      // Agregar los detalles de la asistencia y el total de horas trabajadas al objeto de servicio
      services[i].asistenciaTrabajo = attendanceDetails;
      services[i].totalHorasTrabajadas = totalHoursWorked;
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
  const servicio = await Servicio.findById(req.params.id);

  if (!servicio) {
    res.status(404);
    throw new Error('Servicio no encontrado');
  }

  res.json(servicio);
});

// @desc    Crear un nuevo servicio
// @route   POST /api/servicios
// @access  Privado
const createServicio = asyncHandler(async (req, res) => {
  const { nombre, descripcion, costoEstimado, caracteristicas, fechaInicio, fechaFin, numeroOrdenCompra, fechaAprobacionOrdenCompra, nombreCliente, ubicacion } = req.body;

  if (!nombre || !descripcion || !costoEstimado || !caracteristicas || !fechaInicio) {
    res.status(400);
    throw new Error('Por favor, proporcione nombre, descripcion, costoEstimado, caracteristicas y fechaInicio');
  }

  const servicio = await Servicio.create({
    nombre,
    descripcion,
    costoEstimado,
    caracteristicas,
    fechaInicio,
    fechaFin,
    numeroOrdenCompra,
    fechaAprobacionOrdenCompra,
    nombreCliente,
    ubicacion,
    registradoPor: req.user._id
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
  
      const { nombre, descripcion, costoEstimado, caracteristicas, fechaInicio, fechaFin, numeroOrdenCompra, fechaAprobacionOrdenCompra, nombreCliente, ubicacion } = req.body;
  
      // Crear un objeto con los campos a actualizar
      const camposActualizados = {};
      if (nombre) camposActualizados.nombre = nombre;
      if (descripcion) camposActualizados.descripcion = descripcion;
      if (costoEstimado) camposActualizados.costoEstimado = costoEstimado;
      if (caracteristicas) camposActualizados.caracteristicas = caracteristicas;
      if (fechaInicio) camposActualizados.fechaInicio = fechaInicio;
      if (fechaFin) camposActualizados.fechaFin = fechaFin;
      if (numeroOrdenCompra) camposActualizados.numeroOrdenCompra = numeroOrdenCompra;
      if (fechaAprobacionOrdenCompra) camposActualizados.fechaAprobacionOrdenCompra = fechaAprobacionOrdenCompra;
      if (nombreCliente) camposActualizados.nombreCliente = nombreCliente;
      if (ubicacion) camposActualizados.ubicacion = ubicacion;
  
      // Actualizar el servicio con los campos actualizados
      const servicioActualizado = await Servicio.findByIdAndUpdate(req.params.id, camposActualizados, { new: true, runValidators: true });
  
      res.status(200).json(servicioActualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
// @desc    Eliminar un servicio
// @route   DELETE /api/servicios/:id
// @access  Privado
const deleteServicio = asyncHandler(async (req, res) => {
  const servicio = await Servicio.findById(req.params.id);

  if (!servicio) {
    res.status(404);
    throw new Error('Servicio no encontrado');
  }

  await servicio.remove();
  res.json({ message: 'Servicio eliminado' });
});

module.exports = { getServicios, getServicioById, createServicio, updateServicio, deleteServicio };
