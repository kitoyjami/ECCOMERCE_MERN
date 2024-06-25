const express = require('express');
const { createTipoTarea, getTiposTarea, getTipoTareaById, updateTipoTarea, deleteTipoTarea } = require('../controller/tipoTareaCtrl');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para crear un nuevo tipo de tarea
router.post('/', authMiddleware, createTipoTarea);

// Ruta para obtener todos los tipos de tarea
router.get('/', getTiposTarea);

// Ruta para obtener un tipo de tarea por ID
router.get('/:id', getTipoTareaById);

// Ruta para actualizar un tipo de tarea
router.put('/:id', authMiddleware, updateTipoTarea);

// Ruta para eliminar un tipo de tarea
router.delete('/:id', authMiddleware, deleteTipoTarea);

module.exports = router;
