const express = require("express");
const { createServicio, getServicioById, getServicios, updateServicio, deleteServicio, actualizarServicios } = require("../controller/servicioCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/', authMiddleware, createServicio);
router.get('/:id', authMiddleware, getServicioById);
router.get('/', getServicios);
router.put('/actualizar-todos/:supervisorId', authMiddleware, actualizarServicios);
router.put('/:id', authMiddleware, updateServicio);
router.delete('/:id', authMiddleware, deleteServicio);

module.exports = router;
