const mongoose = require('mongoose');

const subcategoriaProductoSchema = new mongoose.Schema(
    {
    nombre: String, // e.g., 'Consumible', 'Corte'
    categoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CategoriaProducto' 
    } // Referencia a la categoría de producto
  });
  
  const SubcategoriaProducto = mongoose.model('SubcategoriaProducto', subcategoriaProductoSchema);
  
  module.exports = SubcategoriaProducto;
  