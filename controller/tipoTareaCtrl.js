const asyncHandler = require('express-async-handler');
const TipoTarea = require('../models/tipoTareaModel');

// @desc    Crear un nuevo tipo de tarea
// @route   POST /api/tipo-tarea
// @access  Privado
const createTipoTarea = asyncHandler(async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    res.status(400);
    throw new Error('El nombre del tipo de tarea es obligatorio');
  }

  const tipoTarea = new TipoTarea({
    nombre,
    descripcion
  });

  const createdTipoTarea = await tipoTarea.save();
  res.status(201).json(createdTipoTarea);
});

// @desc    Obtener todos los tipos de tarea
// @route   GET /api/tipo-tarea
// @access  Público
const getTiposTarea = asyncHandler(async (req, res) => {
  const tiposTarea = await TipoTarea.find();
  res.status(200).json(tiposTarea);
});

// @desc    Obtener un tipo de tarea por ID
// @route   GET /api/tipo-tarea/:id
// @access  Público
const getTipoTareaById = asyncHandler(async (req, res) => {
  const tipoTarea = await TipoTarea.findById(req.params.id);

  if (!tipoTarea) {
    res.status(404);
    throw new Error('Tipo de tarea no encontrado');
  }

  res.status(200).json(tipoTarea);
});

// @desc    Actualizar un tipo de tarea
// @route   PUT /api/tipo-tarea/:id
// @access  Privado
const updateTipoTarea = asyncHandler(async (req, res) => {
  const { nombre, descripcion } = req.body;

  const tipoTarea = await TipoTarea.findById(req.params.id);

  if (!tipoTarea) {
    res.status(404);
    throw new Error('Tipo de tarea no encontrado');
  }

  tipoTarea.nombre = nombre || tipoTarea.nombre;
  tipoTarea.descripcion = descripcion || tipoTarea.descripcion;

  const updatedTipoTarea = await tipoTarea.save();
  res.status(200).json(updatedTipoTarea);
});

// @desc    Eliminar un tipo de tarea
// @route   DELETE /api/tipo-tarea/:id
// @access  Privado
const deleteTipoTarea = asyncHandler(async (req, res) => {
    const tipoTarea = await TipoTarea.findByIdAndDelete(req.params.id);
  
    if (tipoTarea) {
      res.json({ message: 'Tipo de tarea eliminado' });
    } else {
      res.status(404);
      throw new Error('Tipo de tarea no encontrado');
    }
  });

module.exports = {
  createTipoTarea,
  getTiposTarea,
  getTipoTareaById,
  updateTipoTarea,
  deleteTipoTarea
};
