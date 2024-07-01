const mongoose = require('mongoose');

const tipoProductoSchema = new mongoose.Schema({
    nombre: String // e.g., 'Producto', 'Servicio'
  });
  
  const TipoProducto = mongoose.model('TipoDProducto', tipoProductoSchema);
  
  module.exports = TipoProducto;
  