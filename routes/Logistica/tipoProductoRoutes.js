const express = require('express');
const {
  createTipoProducto,
  updateTipoProducto,
  getTipoProducto,
  getAllTiposProducto,
  deleteTipoProducto
} = require('../../controller/Logistica/tipoProductoCtrl');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Crear un nuevo tipo de producto
router.post('/', authMiddleware, createTipoProducto);

// Obtener todos los tipos de productos
router.get('/', authMiddleware, getAllTiposProducto);

// Obtener un tipo de producto por ID
router.get('/:id', authMiddleware, getTipoProducto);

// Actualizar un tipo de producto por ID
router.put('/:id', authMiddleware, updateTipoProducto);

// Eliminar un tipo de producto por ID
router.delete('/:id', authMiddleware, deleteTipoProducto);

module.exports = router;
