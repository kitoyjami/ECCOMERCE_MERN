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

  const eliminarIndiceUnico = async (req, res) => {
    const { nombreIndice } = req.body;
  
    if (!nombreIndice) {
      return res.status(400).json({ message: 'El nombre del índice es requerido' });
    }
  
    try {
      // Lista todos los índices para asegurarte de que el índice existe
      const indexes = await TipoProducto.collection.indexes();
      console.log('Current indexes:', indexes);
  
      // Verifica si el índice existe
      const indexExists = indexes.some(index => index.name === nombreIndice);
      if (!indexExists) {
        return res.status(404).json({ message: 'Índice no encontrado' });
      }
  
      // Elimina el índice
      await TipoProducto.collection.dropIndex(nombreIndice);
      console.log('Índice eliminado:', nombreIndice);
  
      res.status(200).json({ message: 'Índice eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando índice:', error);
      res.status(500).json({ message: 'Error eliminando índice', error });
    }
  };


module.exports = {
  getAllTiposProducto,
  getTipoProductoById,
  createTipoProducto,
  updateTipoProducto,
  deleteTipoProducto,
  eliminarIndiceUnico
};
