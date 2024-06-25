const Cliente = require('../models/clienteModel');
const asyncHandler = require('express-async-handler');

// Crear nuevo cliente
const createCliente = asyncHandler(async (req, res) => {
  const { rucDni, nombreComercial, direccionEntrega, nombreContacto, correoContacto, nroContacto, notas } = req.body;

  if (!rucDni || !nombreComercial || !direccionEntrega || !nombreContacto || !correoContacto || !nroContacto) {
    res.status(400);
    throw new Error('Por favor, complete todos los campos obligatorios');
  }

  const clienteExistente = await Cliente.findOne({ rucDni });
  if (clienteExistente) {
    res.status(400);
    throw new Error('El cliente ya existe');
  }

  const cliente = new Cliente({
    rucDni,
    nombreComercial,
    direccionEntrega,
    nombreContacto,
    correoContacto,
    nroContacto,
    registradoPor: req.user._id,
    notas
  });

  await cliente.save();
  res.status(201).json(cliente);
});

// Obtener todos los clientes
const getClientes = asyncHandler(async (req, res) => {
  const clientes = await Cliente.find().populate('registradoPor', 'name').populate('historialPedidos');
  res.status(200).json(clientes);
});

// Obtener cliente por ID
const getClienteById = asyncHandler(async (req, res) => {
  const cliente = await Cliente.findById(req.params.id).populate('registradoPor', 'name').populate('historialPedidos');
  
  if (!cliente) {
    res.status(404);
    throw new Error('Cliente no encontrado');
  }

  res.status(200).json(cliente);
});

// Actualizar cliente
const updateCliente = asyncHandler(async (req, res) => {
  const { rucDni, nombreComercial, direccionEntrega, nombreContacto, correoContacto, nroContacto, estado, notas } = req.body;
  const cliente = await Cliente.findById(req.params.id);

  if (!cliente) {
    res.status(404);
    throw new Error('Cliente no encontrado');
  }

  cliente.rucDni = rucDni || cliente.rucDni;
  cliente.nombreComercial = nombreComercial || cliente.nombreComercial;
  cliente.direccionEntrega = direccionEntrega || cliente.direccionEntrega;
  cliente.nombreContacto = nombreContacto || cliente.nombreContacto;
  cliente.correoContacto = correoContacto || cliente.correoContacto;
  cliente.nroContacto = nroContacto || cliente.nroContacto;
  cliente.estado = estado !== undefined ? estado : cliente.estado;
  cliente.notas = notas || cliente.notas;

  const clienteActualizado = await cliente.save();
  res.status(200).json(clienteActualizado);
});

// Eliminar cliente
const deleteCliente = asyncHandler(async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);

  if (!cliente) {
    res.status(404);
    throw new Error('Cliente no encontrado');
  }

  await cliente.remove();
  res.status(200).json({ message: 'Cliente eliminado' });
});

module.exports = {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente
};
