const TipoProducto = require('../models/tipoProductoModel');

// Obtener todos los tipos de producto
const getAllTiposProducto = async (req, res) => {
  try {
    const tiposProducto = await TipoProducto.find();
    res.json(tiposProducto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un tipo de producto por su ID
const getTipoProductoById = async (req, res) => {
  try {
    const tipoProducto = await TipoProducto.findById(req.params.id);
    if (!tipoProducto) {
      return res.status(404).json({ message: 'Tipo de producto no encontrado' });
    }
    res.json(tipoProducto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo tipo de producto
const createTipoProducto = async (req, res) => {
  try {
    const nuevoTipoProducto = await TipoProducto.create(req.body);
    res.status(201).json(nuevoTipoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un tipo de producto
const updateTipoProducto = async (req, res) => {

    try {
      const tipoProducto = await TipoProducto.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!tipoProducto) {
          return res.status(404).json({ message: 'Tipo Producto de medida no encontrado' });
      }
      res.json(tipoProducto);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }

  };
// Eliminar un tipo de producto o una subcategoría
const deleteTipoProducto = async (req, res) => {
       try {
      const tipoProducto = await TipoProducto.findByIdAndDelete(req.params.id);
      if (!tipoProducto) {
          return res.status(404).json({ message: 'Tipo producto no encontrado' });
      }
      res.json({ message: 'Tipo de producto eliminado correctamente' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  };

module.exports = {
  getAllTiposProducto,
  getTipoProductoById,
  createTipoProducto,
  updateTipoProducto,
  deleteTipoProducto
};
