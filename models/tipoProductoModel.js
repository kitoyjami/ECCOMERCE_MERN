const mongoose = require('mongoose');
const { Schema } = mongoose;

const TipoProductoSchema = new Schema({
    categoria: { 
        type: String, 
        required: true,
    },
    tipo:{
        type: String, 
        required: true,
    },
    subcategoria: [
        {
            type: String
        }
    ], 

  });
  
module.exports = mongoose.model('TipoProducto', TipoProductoSchema);
  