const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductoCrsSchema = new Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    marca: { 
        type: String, 
        required: true 
    },
    tipo: { 
        type: Schema.Types.ObjectId, 
        ref: 'TipoProducto', 
        required: true 
    },
    unidadesMedida: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'UnidadMedida', 
            required: true 
        }
    ]
  });
  
  module.exports = mongoose.model('ProductoCrs', ProductoCrsSchema);
  