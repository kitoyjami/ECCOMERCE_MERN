const express = require('express');
const {
  createProducto,
  updateProducto,
  getProducto,
  getAllProductos,
  deleteProducto
} = require('../../controller/Logistica/productoCtrl');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Crear un nuevo producto
router.post('/', authMiddleware, createProducto);

// Obtener todos los productos
router.get('/', authMiddleware, getAllProductos);

// Obtener un producto por ID
router.get('/:id', authMiddleware, getProducto);

// Actualizar un producto por ID
router.put('/:id', authMiddleware, updateProducto);

// Eliminar un producto por ID
router.delete('/:id', authMiddleware, deleteProducto);

module.exports = router;
