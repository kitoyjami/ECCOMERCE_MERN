const RendicionCuenta = require('../models/rendicionCuentaModel');
const ProductoCrs = require('../models/productCrsModel');
const UnidadMedida = require('../models/unidadesMode');
const Servicio = require('../models/servicioModel');
const Proveedor = require('../models/proveedorModel');
const User = require('../models/userModel');

// Crear una nueva rendición de cuenta
const createRendicionCuenta = async (req, res) => {
  try {
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
    res.status(201).json(nuevaRendicionCuenta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las rendiciones de cuenta
const getAllRendicionesCuenta = async (req, res) => {
  try {
    const rendicionesCuenta = await RendicionCuenta.find()
      .populate('proveedor','rucDni nombreComercial nroContacto')
      .populate('descripcionComprobante.producto','nombre marca tipo')
      .populate('descripcionComprobante.unidadMedida')
      .populate('descripcionComprobante.servicio')
      .populate('registradoPor.user','lasttname firstname email');
    res.json(rendicionesCuenta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una rendición de cuenta por ID
const getRendicionCuentaById = async (req, res) => {
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
};

// Actualizar una rendición de cuenta por ID
const updateRendicionCuenta = async (req, res) => {
  try {
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
    res.json(rendicionCuenta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una rendición de cuenta por ID
const deleteRendicionCuenta = async (req, res) => {
  try {
    const rendicionCuenta = await RendicionCuenta.findByIdAndDelete(req.params.id);
    if (!rendicionCuenta) {
      return res.status(404).json({ message: 'Rendición de cuenta no encontrada' });
    }
    res.json({ message: 'Rendición de cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRendicionCuenta,
  getAllRendicionesCuenta,
  getRendicionCuentaById,
  updateRendicionCuenta,
  deleteRendicionCuenta
};
