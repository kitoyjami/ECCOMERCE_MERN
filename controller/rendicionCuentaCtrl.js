const asyncHandler = require('express-async-handler');
const RendicionCuenta = require('../models/rendicionCuentaModel');
const Servicio = require('../models/servicioModel');

// Crear una nueva rendición de cuenta
const createRendicionCuenta = asyncHandler(async (req, res) => {
  const {
    fecha,
    tipoComprobante,
    foto,
    estado,
    proveedor,
    descripcionComprobante,
    agregarIGV
  } = req.body;

  const nuevaRendicionCuenta = new RendicionCuenta({
    fecha,
    tipoComprobante,
    foto,
    estado,
    proveedor,
    descripcionComprobante,
    agregarIGV,
    registradoPor: { user: req.user._id }
  });

  await nuevaRendicionCuenta.save();

  // Actualizar el registro de gastos en el servicio correspondiente
  const serviciosIds = descripcionComprobante.map(desc => desc.servicio);
  await Servicio.updateMany(
    { _id: { $in: serviciosIds } },
    { $push: { registroGastos: nuevaRendicionCuenta._id } }
  );

  res.status(201).json(nuevaRendicionCuenta);
});

// Obtener todas las rendiciones de cuenta
const getAllRendicionesCuenta = asyncHandler(async (req, res) => {
  const rendicionesCuenta = await RendicionCuenta.find()
    .populate('proveedor', 'rucDni nombreComercial nroContacto')
    .populate('descripcionComprobante.producto', 'nombre marca tipo')
    .populate('descripcionComprobante.unidadMedida')
    .populate('descripcionComprobante.servicio')
    .populate('registradoPor.user', 'lasttname firstname email');
  res.json(rendicionesCuenta);
});

// Obtener una rendición de cuenta por ID
const getRendicionCuentaById = asyncHandler(async (req, res) => {
  const rendicionCuenta = await RendicionCuenta.findById(req.params.id)
    .populate('proveedor')
    .populate('descripcionComprobante.producto')
    .populate('descripcionComprobante.unidadMedida')
    .populate('descripcionComprobante.servicio')
    .populate('registradoPor.user');
  if (!rendicionCuenta) {
    res.status(404);
    throw new Error('Rendición de cuenta no encontrada');
  }
  res.json(rendicionCuenta);
});

// Actualizar una rendición de cuenta por ID
const updateRendicionCuenta = asyncHandler(async (req, res) => {
  const rendicionCuenta = await RendicionCuenta.findById(req.params.id);
  if (!rendicionCuenta) {
    res.status(404);
    throw new Error('Rendición de cuenta no encontrada');
  }

  const {
    fecha,
    tipoComprobante,
    foto,
    estado,
    proveedor,
    descripcionComprobante,
    agregarIGV
  } = req.body;

  if (fecha) rendicionCuenta.fecha = fecha;
  if (tipoComprobante) rendicionCuenta.tipoComprobante = tipoComprobante;
  if (foto) rendicionCuenta.foto = foto;
  if (estado !== undefined) rendicionCuenta.estado = estado;
  if (proveedor) rendicionCuenta.proveedor = proveedor;
  if (agregarIGV !== undefined) rendicionCuenta.agregarIGV = agregarIGV;

  // Actualizar o agregar descripciones de comprobante
  if (descripcionComprobante) {
    descripcionComprobante.forEach(desc => {
      const index = rendicionCuenta.descripcionComprobante.findIndex(d => d._id.toString() === desc._id);
      if (index !== -1) {
        rendicionCuenta.descripcionComprobante[index] = desc;
      } else {
        rendicionCuenta.descripcionComprobante.push(desc);
      }
    });
  }

  await rendicionCuenta.save();

  // Actualizar el registro de gastos en el servicio correspondiente
  const serviciosIds = descripcionComprobante.map(desc => desc.servicio);
  await Servicio.updateMany(
    { _id: { $in: serviciosIds } },
    { $addToSet: { registroGastos: rendicionCuenta._id } }
  );

  res.json(rendicionCuenta);
});

// Eliminar una rendición de cuenta por ID
const deleteRendicionCuenta = asyncHandler(async (req, res) => {
  const rendicionCuenta = await RendicionCuenta.findByIdAndDelete(req.params.id);
  if (!rendicionCuenta) {
    res.status(404);
    throw new Error('Rendición de cuenta no encontrada');
  }
  res.json({ message: 'Rendición de cuenta eliminada correctamente' });
});

module.exports = {
  createRendicionCuenta,
  getAllRendicionesCuenta,
  getRendicionCuentaById,
  updateRendicionCuenta,
  deleteRendicionCuenta
};
