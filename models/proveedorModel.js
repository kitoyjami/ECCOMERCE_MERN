const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProveedorSchema = new Schema({
    rucDni: { 
        type: String, 
        required: true,
        unique:true
    },
    nombreComercial: { 
        type: String, 
        required: true 
    },
    estado: { 
        type: Boolean,
        default: true 
    },
    tiposProducto: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'TipoProducto' 
        }],
    tiposServicio: [
        { 
            type: Schema.Types.ObjectId, 
            ref: 'TipoServiciosTercero'
        }],
    direccion: { 
        type: String, 
        required: true 
    },
    nroContacto: { 
        type: String,
        required: true 
    },
    registradoPor: {
         user: { 
            type: Schema.Types.ObjectId,
             ref: 'User', 
             required: true 
            } }
  });
  
  module.exports = mongoose.model('Proveedor', ProveedorSchema);
  