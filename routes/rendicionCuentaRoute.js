const express = require("express");
const { 
    createRendicionCuenta,
    getAllRendicionesCuenta,
    getRendicionCuentaById,
    updateRendicionCuenta,
    deleteRendicionCuenta
} = require("../controller/rendicionCuentaCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Ruta para crear una nueva rendición de cuenta
router.post('/', authMiddleware, isAdmin, createRendicionCuenta);

// Ruta para actualizar una rendición de cuenta existente por ID
router.put('/:id', authMiddleware, isAdmin, updateRendicionCuenta);

// Ruta para eliminar una rendición de cuenta existente por ID
router.delete('/:id', authMiddleware, isAdmin, deleteRendicionCuenta);

// Ruta para obtener una rendición de cuenta específica por ID
router.get('/:id', getRendicionCuentaById);

// Ruta para obtener todas las rendiciones de cuenta
router.get('/', getAllRendicionesCuenta);

module.exports = router;
