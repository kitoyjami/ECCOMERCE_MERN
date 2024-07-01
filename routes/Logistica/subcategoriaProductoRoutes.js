const express = require('express');
const {
  createSubcategoriaProducto,
  updateSubcategoriaProducto,
  getSubcategoriaProducto,
  getAllSubcategoriasProducto,
  deleteSubcategoriaProducto
} = require('../../controller/Logistica/subcategoriaProductoCtrl');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Crear una nueva subcategoría de producto
router.post('/', authMiddleware, createSubcategoriaProducto);

// Obtener todas las subcategorías de productos
router.get('/', authMiddleware, getAllSubcategoriasProducto);

// Obtener una subcategoría de producto por ID
router.get('/:id', authMiddleware, getSubcategoriaProducto);

// Actualizar una subcategoría de producto por ID
router.put('/:id', authMiddleware, updateSubcategoriaProducto);

// Eliminar una subcategoría de producto por ID
router.delete('/:id', authMiddleware, deleteSubcategoriaProducto);

module.exports = router;
