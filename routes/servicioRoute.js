const express = require("express")
const { createServicio, getServicioById, getServicios, updateServicio, deleteServicio, actualizarServicios } = require("../controller/servicioCtrl")
const { authMiddleware} = require("../middlewares/authMiddleware")
const router = express.Router()


// Ruta para crear un nuevo reporte diario
router.post('/',authMiddleware, createServicio);

// Ruta para obtener un reporte diario por fecha
router.get('/:id',authMiddleware, getServicioById)

// Ruta para obtener todos los reportes diarios
router.get('/', getServicios);

// Ruta para actualizar un reporte diario por fecha
router.put('/:id',authMiddleware, updateServicio);
//router.put('/actualizar-servicios',authMiddleware, actualizarServicios);


// Ruta para eliminar un reporte diario por fecha
router.delete('/:id',authMiddleware, deleteServicio);

module.exports=router