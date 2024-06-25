const express = require('express');
const { createCliente, getClientes, getClienteById, updateCliente, deleteCliente } = require('../controller/clienteCtrl');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createCliente);
router.get('/', authMiddleware, getClientes);
router.get('/:id', authMiddleware, getClienteById);
router.put('/:id', authMiddleware, updateCliente);
router.delete('/:id', authMiddleware, deleteCliente);

module.exports = router;
