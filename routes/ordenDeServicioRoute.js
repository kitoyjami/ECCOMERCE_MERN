const express = require('express');
const {
  createOrdenDeServicio,
  getOrdenesDeServicio,
  getOrdenDeServicioById,
  updateOrdenDeServicio,
  deleteOrdenDeServicio
} = require('../controller/ordenDeServicioCtrl');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Crear una nueva orden de servicio
router.post('/', authMiddleware, createOrdenDeServicio);

// Obtener todas las ordenes de servicio
router.get('/', authMiddleware, getOrdenesDeServicio);

// Obtener una orden de servicio por su ID
router.get('/:id', authMiddleware, getOrdenDeServicioById);

// Actualizar una orden de servicio
router.put('/:id', authMiddleware, updateOrdenDeServicio);

// Eliminar una orden de servicio
router.delete('/:id', authMiddleware, deleteOrdenDeServicio);

module.exports = router;
