const express = require("express")
const { createServicio, getServicioById, getServicios, updateServicio, deleteServicio } = require("../controller/servicioCtrl")
const { authMiddleware} = require("../middlewares/authMiddleware")
const router = express.Router()


// Ruta para crear un nuevo reporte diario
router.post('/',authMiddleware, createServicio);

// Ruta para obtener un reporte diario por fecha
router.get('/:id',authMiddleware, getServicioById)

// Ruta para obtener todos los reportes diarios
router.get('/',authMiddleware, getServicios);

// Ruta para actualizar un reporte diario por fecha
router.put('/:id',authMiddleware, updateServicio);

// Ruta para eliminar un reporte diario por fecha
router.delete('/:fecha',authMiddleware, deleteServicio);

module.exports=router