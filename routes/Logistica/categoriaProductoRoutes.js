const express = require('express');
const {
  createCategoriaProducto,
  updateCategoriaProducto,
  getCategoriaProducto,
  getAllCategoriasProducto,
  deleteCategoriaProducto
} = require('../../controller/Logistica/categoriaProductoCtrl');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Crear una nueva categoría de producto
router.post('/', authMiddleware, createCategoriaProducto);

// Obtener todas las categorías de productos
router.get('/', authMiddleware, getAllCategoriasProducto);

// Obtener una categoría de producto por ID
router.get('/:id', authMiddleware, getCategoriaProducto);

// Actualizar una categoría de producto por ID
router.put('/:id', authMiddleware, updateCategoriaProducto);

// Eliminar una categoría de producto por ID
router.delete('/:id', authMiddleware, deleteCategoriaProducto);

module.exports = router;
