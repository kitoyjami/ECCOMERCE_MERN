const mongoose = require('mongoose');

const tipoProductoSchema = new mongoose.Schema({
    nombre: String,
    tipoInterno: { 
      type: String, 
      enum: ['Producto', 'Servicio'] 
    },
  });
  
  const TipoProducto = mongoose.model('TipoDProducto', tipoProductoSchema);
  
  module.exports = TipoProducto;
  