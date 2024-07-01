const mongoose = require('mongoose');

const categoriaProductoSchema = new mongoose.Schema(
    {
    nombre: String, // e.g., 'Materia Prima', 'Servicios profesionales'
    tipo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TipoDProducto' 
    } // Referencia al tipo de producto
  }
);
  
  const CategoriaProducto = mongoose.model('CategoriaProducto', categoriaProductoSchema);
  
  module.exports = CategoriaProducto;
  