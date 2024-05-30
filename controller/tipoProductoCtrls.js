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
      const tipoProducto = await TipoProducto.findById(req.params.id);
      if (!tipoProducto) {
        return res.status(404).json({ message: 'Tipo de producto no encontrado' });
      }
  
      const { title, caracteristica } = req.body;
  
      // Actualizar title si se proporciona
      if (title) {
        tipoProducto.title = title;
      }
  
      // Agregar nueva característica si no existe
      if (caracteristica) {
        if (tipoProducto.caracteristica.includes(caracteristica)) {
          return res.status(400).json({ message: 'La característica ya existe en el tipo de producto' });
        }
        tipoProducto.caracteristica.push(caracteristica);
      }
  
      const tipoProductoActualizado = await tipoProducto.save();
      res.json(tipoProductoActualizado);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
// Eliminar un tipo de producto o una subcategoría
const deleteTipoProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const { caracteristica } = req.body;
  
      const tipoProducto = await TipoProducto.findById(id);
      if (!tipoProducto) {
        return res.status(404).json({ message: 'Tipo de producto no encontrado' });
      }
  
      // Eliminar característica si se proporciona
      if (caracteristica) {
        if (!tipoProducto.caracteristica.includes(caracteristica)) {
          return res.status(400).json({ message: 'La característica no existe en el tipo de producto' });
        }
        tipoProducto.caracteristica = tipoProducto.caracteristica.filter(carac => carac !== caracteristica);
        await tipoProducto.save();
        return res.json({ message: 'Característica eliminada correctamente' });
      }
  
      // Si no se proporcionó ninguna característica, eliminar todo el tipo de producto
      await TipoProducto.findByIdAndDelete(id);
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
