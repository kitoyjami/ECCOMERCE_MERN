const asyncHandler = require('express-async-handler');
const OrdenDeServicio = require('../models/ordenDeServicioModel');
const Cliente = require('../models/clienteModel');

// Crear una nueva orden de servicio
const createOrdenDeServicio = asyncHandler(async (req, res) => {
  const { cliente, precio, estado, serviciosAsignados, fechaInicio, fechaFin } = req.body;

  if (!cliente || !precio || !fechaInicio) {
    res.status(400);
    throw new Error('Por favor, proporcione cliente, precio y fecha de inicio');
  }

  const ordenDeServicio = new OrdenDeServicio({
    cliente,
    precio,
    estado: estado || 'pendiente',
    serviciosAsignados: serviciosAsignados || [],
    fechaInicio,
    fechaFin,
    registradoPor: req.user._id
  });

  const createdOrdenDeServicio = await ordenDeServicio.save();
  res.status(201).json(createdOrdenDeServicio);
});

// Obtener todas las ordenes de servicio
const getOrdenesDeServicio = asyncHandler(async (req, res) => {
  const ordenes = await OrdenDeServicio.find()
    .populate('cliente')
    .populate('serviciosAsignados')
    .populate('registradoPor');
  res.status(200).json(ordenes);
});

// Obtener una orden de servicio por su ID
const getOrdenDeServicioById = asyncHandler(async (req, res) => {
  const orden = await OrdenDeServicio.findById(req.params.id)
    .populate('cliente')
    .populate('serviciosAsignados')
    .populate('registradoPor');

  if (orden) {
    res.status(200).json(orden);
  } else {
    res.status(404);
    throw new Error('Orden de servicio no encontrada');
  }
});

// Actualizar una orden de servicio
const updateOrdenDeServicio = asyncHandler(async (req, res) => {
  const { cliente, precio, estado, serviciosAsignados, fechaInicio, fechaFin } = req.body;

  const orden = await OrdenDeServicio.findById(req.params.id);

  if (orden) {
    orden.cliente = cliente || orden.cliente;
    orden.precio = precio || orden.precio;
    orden.estado = estado || orden.estado;
    orden.serviciosAsignados = serviciosAsignados || orden.serviciosAsignados;
    orden.fechaInicio = fechaInicio || orden.fechaInicio;
    orden.fechaFin = fechaFin || orden.fechaFin;
    orden.registradoPor = req.user._id || orden.registradoPor;

    const updatedOrdenDeServicio = await orden.save();
    res.status(200).json(updatedOrdenDeServicio);
  } else {
    res.status(404);
    throw new Error('Orden de servicio no encontrada');
  }
});

// Eliminar una orden de servicio
const deleteOrdenDeServicio = asyncHandler(async (req, res) => {
    try {
      const orden = await OrdenDeServicio.findByIdAndDelete(req.params.id);
  
      if (orden) {
        res.status(200).json({ message: 'Orden de servicio eliminada' });
      } else {
        res.status(404).json({ message: 'Orden de servicio no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = {
  createOrdenDeServicio,
  getOrdenesDeServicio,
  getOrdenDeServicioById,
  updateOrdenDeServicio,
  deleteOrdenDeServicio
};
