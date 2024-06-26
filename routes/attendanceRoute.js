const express = require('express');
const {
  createAttendance,
  updateAttendance,
  getAttendanceById,
  getAttendances,
  deleteAttendance,
  actualizarAsistencias
} = require('../controller/attendanceCtrl');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Crear nueva asistencia
router.post('/', authMiddleware, createAttendance);

// Obtener todas las asistencias con filtros opcionales
router.get('/', authMiddleware, getAttendances);

// Obtener una asistencia por su ID
router.get('/:id', authMiddleware, getAttendanceById);

// Actualizar una asistencia existente
router.put('/:id', authMiddleware, updateAttendance);
router.put('/actualizar-todas', authMiddleware, actualizarAsistencias);

// Eliminar una asistencia existente
router.delete('/:id', authMiddleware, deleteAttendance);

// Actualizar todas las asistencias existentes con nuevos campos

module.exports = router;

