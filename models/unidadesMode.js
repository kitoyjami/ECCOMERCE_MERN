const mongoose = require('mongoose');
const { Schema } = mongoose;

const UnidadMedidaSchema = new Schema({
  nombre: { 
    type: String, 
    required: true 
    },
    abreviatura: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('UnidadMedida', UnidadMedidaSchema);
