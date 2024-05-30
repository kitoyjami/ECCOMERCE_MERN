const mongoose = require('mongoose');
const { Schema } = mongoose;

const TipoServiciosTerceroSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    }
  });
  
  module.exports = mongoose.model('TipoServiciosTercero', TipoServiciosTerceroSchema);