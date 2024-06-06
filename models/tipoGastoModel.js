const mongoose = require('mongoose');
const { Schema } = mongoose;

const TipoGastoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  registradoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('TipoGasto', TipoGastoSchema);
