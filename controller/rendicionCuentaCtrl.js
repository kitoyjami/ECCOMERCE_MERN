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
    agregarIGV,
    nroComprobante,
    moneda,
    tipoCambio,
  } = req.body;

  // Verificar que descripcionComprobante es un arreglo
  if (!Array.isArray(descripcionComprobante)) {
    return res.status(400).json({ message: 'descripcionComprobante debe ser un arreglo' });
  }

  const nuevaRendicionCuenta = new RendicionCuenta({
    fecha,
    tipoComprobante,
    foto,
    estado,
    proveedor,
    descripcionComprobante,
    agregarIGV,
    nroComprobante,
    moneda,
    tipoCambio,
    registradoPor: { user: req.user._id }
  });

  const rendicionGuardada = await nuevaRendicionCuenta.save();

  // Actualizar el total de gasto en los servicios correspondientes
  for (const desc of descripcionComprobante) {
    const costoEnSoles = desc.moneda === 'Soles' ? desc.costoTotal : desc.costoTotal * desc.tipoCambio;
    await Servicio.findByIdAndUpdate(desc.servicio, {
      $inc: {
        totalGastadoSoles: desc.moneda === 'Soles' ? desc.costoTotal : 0,
        totalGastadoDolares: desc.moneda === 'Dolares' ? desc.costoTotal : 0,
        totalGastado: costoEnSoles
      },
      $push: { registroGastos: { producto: desc.producto, rendicionCuenta: rendicionGuardada._id } }
    });
  }

  res.status(201).json(rendicionGuardada);
});


// Obtener todas las rendiciones de cuenta
const getAllRendicionesCuenta = asyncHandler(async (req, res) => {
  try {
    const rendicionesCuenta = await RendicionCuenta.find()
      .populate('proveedor', 'rucDni nombreComercial nroContacto')
      .populate('descripcionComprobante.producto', 'nombre marca tipo')
      .populate('descripcionComprobante.unidadMedida')
      .populate('descripcionComprobante.servicio')
      .populate('registradoPor.user', 'lasttname firstname email');
    res.json(rendicionesCuenta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una rendición de cuenta por ID
const getRendicionCuentaById = asyncHandler(async (req, res) => {
  try {
    const rendicionCuenta = await RendicionCuenta.findById(req.params.id)
      .populate('proveedor')
      .populate('descripcionComprobante.producto')
      .populate('descripcionComprobante.unidadMedida')
      .populate('descripcionComprobante.servicio')
      .populate('registradoPor.user');
    if (!rendicionCuenta) {
      return res.status(404).json({ message: 'Rendición de cuenta no encontrada' });
    }
    res.json(rendicionCuenta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una rendición de cuenta por ID
const updateRendicionCuenta = asyncHandler(async (req, res) => {
  const rendicionCuenta = await RendicionCuenta.findById(req.params.id);
  if (!rendicionCuenta) {
    return res.status(404).json({ message: 'Rendición de cuenta no encontrada' });
  }

  const {
    fecha,
    tipoComprobante,
    foto,
    estado,
    proveedor,
    descripcionComprobante,
    agregarIGV,
    nroComprobante,
    moneda,
    tipoCambio,
  } = req.body;

  if (fecha) rendicionCuenta.fecha = fecha;
  if (tipoComprobante) rendicionCuenta.tipoComprobante = tipoComprobante;
  if (foto) rendicionCuenta.foto = foto;
  if (estado !== undefined) rendicionCuenta.estado = estado;
  if (proveedor) rendicionCuenta.proveedor = proveedor;
  if (agregarIGV !== undefined) rendicionCuenta.agregarIGV = agregarIGV;
  if (nroComprobante) rendicionCuenta.nroComprobante = nroComprobante;
  if (moneda) rendicionCuenta.moneda = moneda;
  if (tipoCambio !== undefined) rendicionCuenta.tipoCambio = tipoCambio;

  const originalDescripcionComprobante = rendicionCuenta.descripcionComprobante;

  // Actualizar o agregar descripciones de comprobante
  if (descripcionComprobante) {
    // Remover costos de los servicios asociados a los elementos eliminados y eliminar del registro de gastos
    originalDescripcionComprobante.forEach(async (originalDesc) => {
      const exists = descripcionComprobante.find(desc => desc._id && desc._id.toString() === originalDesc._id.toString());
      if (!exists) {
        const costoEnSoles = originalDesc.moneda === 'Soles' ? originalDesc.costoTotal : originalDesc.costoTotal * originalDesc.tipoCambio;
        await Servicio.findByIdAndUpdate(originalDesc.servicio, {
          $inc: {
            totalGastadoSoles: originalDesc.moneda === 'Soles' ? -originalDesc.costoTotal : 0,
            totalGastadoDolares: originalDesc.moneda === 'Dolares' ? -originalDesc.costoTotal : 0,
            totalGastado: -costoEnSoles
          },
          $pull: { registroGastos: { producto: originalDesc.producto, rendicionCuenta: rendicionCuenta._id } }
        });
      }
    });

    descripcionComprobante.forEach(desc => {
      const index = rendicionCuenta.descripcionComprobante.findIndex(d => d._id.toString() === desc._id);
      if (index !== -1) {
        rendicionCuenta.descripcionComprobante[index] = desc;
      } else {
        rendicionCuenta.descripcionComprobante.push(desc);
      }
    });
  }

  const rendicionActualizada = await rendicionCuenta.save();

  // Actualizar el total de gasto en los servicios correspondientes
  for (const desc of descripcionComprobante) {
    const costoEnSoles = desc.moneda === 'Soles' ? desc.costoTotal : desc.costoTotal * desc.tipoCambio;
    await Servicio.findByIdAndUpdate(desc.servicio, {
      $inc: {
        totalGastadoSoles: desc.moneda === 'Soles' ? desc.costoTotal : 0,
        totalGastadoDolares: desc.moneda === 'Dolares' ? desc.costoTotal : 0,
        totalGastado: costoEnSoles
      },
      $addToSet: { registroGastos: { producto: desc.producto, rendicionCuenta: rendicionActualizada._id } }
    });
  }

  res.json(rendicionActualizada);
});

// Eliminar una rendición de cuenta por ID
const deleteRendicionCuenta = asyncHandler(async (req, res) => {
  const rendicionCuenta = await RendicionCuenta.findByIdAndDelete(req.params.id);
  if (!rendicionCuenta) {
    return res.status(404).json({ message: 'Rendición de cuenta no encontrada' });
  }

  // Remover costos de los servicios asociados a los elementos eliminados y eliminar del registro de gastos
  for (const desc of rendicionCuenta.descripcionComprobante) {
    const costoEnSoles = desc.moneda === 'Soles' ? desc.costoTotal : desc.costoTotal * desc.tipoCambio;
    await Servicio.findByIdAndUpdate(desc.servicio, {
      $inc: {
        totalGastadoSoles: desc.moneda === 'Soles' ? -desc.costoTotal : 0,
        totalGastadoDolares: desc.moneda === 'Dolares' ? -desc.costoTotal : 0,
        totalGastado: -costoEnSoles
      },
      $pull: { registroGastos: { producto: desc.producto, rendicionCuenta: rendicionCuenta._id } }
    });
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
