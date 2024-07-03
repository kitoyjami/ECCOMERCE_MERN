const mongoose = require('mongoose');
const { Schema } = mongoose;

const DescripcionComprobanteSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  unidadMedida: {
    type: Schema.Types.ObjectId,
    ref: 'UnidadMedida',
    required: true
  },
  costoTotal: {
    type: Number,
    min: 0,
    default: function () {
      return this.cantidad * this.precioUnitario;
    }
  },
  servicio: {
    type: Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  tipoGasto: {
    type: Schema.Types.ObjectId,
    ref: 'TipoGasto',
    required: true
  },
  moneda: {
    type: String,
    required: true,
    enum: ['Soles', 'Dolares']
  },
  tipoCambio: {
    type: Number,
    required: function() { return this.moneda === 'Dolares'; },
    min: 0
  }
});

module.exports = mongoose.model('DescripcionComprobante', DescripcionComprobanteSchema);
