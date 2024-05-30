const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServicioTerceroSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    tipo: { 
        type: Schema.Types.ObjectId, 
        ref: 'TipoServiciosTercero', 
        required: true 
    },
    unidadesMedida: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'UnidadMedida',
            required: true 
        }]
  });
  
  module.exports = mongoose.model('ServicioTercero', ServicioTerceroSchema);
  