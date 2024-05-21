const express = require("express")
const {  updateDailyReport, deleteDailyReport, getAllDailyReports, getDailyReportByDate, generateDailyReport } = require("../controller/partediarioCtrl")
const { authMiddleware} = require("../middlewares/authMiddleware")
const router = express.Router()


// Ruta para crear un nuevo reporte diario
router.post('/',authMiddleware, generateDailyReport);

// Ruta para obtener un reporte diario por fecha
router.get('/:fecha',authMiddleware, getDailyReportByDate);

// Ruta para obtener todos los reportes diarios
router.get('/',authMiddleware, getAllDailyReports);

// Ruta para actualizar un reporte diario por fecha
router.put('/:fecha',authMiddleware, updateDailyReport);

// Ruta para eliminar un reporte diario por fecha
router.delete('/:fecha',authMiddleware, deleteDailyReport);

module.exports=router