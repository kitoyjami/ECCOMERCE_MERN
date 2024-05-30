const mongoose = require('mongoose');
const { Schema } = mongoose;

const TipoProductoSchema = new Schema({
  categoria: { 
    type: String, 
    required: true, 
    enum: ['Producto', 'Servicio Tercero'] 
  },
  title: {
    type: String, 
    required: true,
    unique: true
  },
  subcategoria: 
    {
      type: String
    }
  , 
  caracteristica: [
    {
      type: String
    }
  ], 
});

module.exports = mongoose.model('TipoProducto', TipoProductoSchema);

  