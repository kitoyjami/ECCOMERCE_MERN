const TipoGasto = require('../models/tipoGastoModel');
const asyncHandler = require('express-async-handler');

// Crear un nuevo tipo de gasto
const createTipoGasto = asyncHandler(async (req, res) => {
  const { nombre, descripcion } = req.body;

  const nuevoTipoGasto = new TipoGasto({
    nombre,
    descripcion,
    registradoPor: req.user._id 
  });

  const tipoGastoGuardado = await nuevoTipoGasto.save();
  res.status(201).json(tipoGastoGuardado);
});

// Obtener todos los tipos de gasto
const getAllTiposGasto = asyncHandler(async (req, res) => {
  const tiposGasto = await TipoGasto.find().populate('registradoPor', 'lasttname firstname email');
  res.status(200).json(tiposGasto);
});

// Obtener un tipo de gasto por ID
const getTipoGastoById = asyncHandler(async (req, res) => {
  const tipoGasto = await TipoGasto.findById(req.params.id).populate('registradoPor', 'lasttname firstname email');
  
  if (!tipoGasto) {
    res.status(404);
    throw new Error('Tipo de gasto no encontrado');
  }

  res.status(200).json(tipoGasto);
});

// Actualizar un tipo de gasto por ID
const updateTipoGasto = asyncHandler(async (req, res) => {
  const { nombre, descripcion } = req.body;

  const tipoGasto = await TipoGasto.findById(req.params.id);

  if (!tipoGasto) {
    res.status(404);
    throw new Error('Tipo de gasto no encontrado');
  }

  tipoGasto.nombre = nombre || tipoGasto.nombre;
  tipoGasto.descripcion = descripcion || tipoGasto.descripcion;

  const tipoGastoActualizado = await tipoGasto.save();
  res.status(200).json(tipoGastoActualizado);
});

// Eliminar un tipo de gasto por ID
const deleteTipoGasto = asyncHandler(async (req, res) => {
  try {
    const tipoGasto = await TipoGasto.findByIdAndDelete(req.params.id);
    if (!tipoGasto) {
        return res.status(404).json({ message: 'Tipo de gasto no encontrado' });
    }
    res.json({ message: 'Tipo de gasto eliminado correctamente' });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

module.exports = {
  createTipoGasto,
  getAllTiposGasto,
  getTipoGastoById,
  updateTipoGasto,
  deleteTipoGasto
};
