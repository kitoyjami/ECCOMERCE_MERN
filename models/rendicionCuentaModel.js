const mongoose = require('mongoose');
const { Schema } = mongoose;
const DescripcionComprobante = require('./DescripcionComprobante');

const RendicionCuentaSchema = new Schema({
  fecha: {
    type: Date,
    required: true
  },
  tipoComprobante: {
    type: String,
    required: true,
    enum: ['Factura', 'Boleta', 'Sin comprobante']
  },
  nroComprobante: {
    type: String,
    required: true,
  },
  foto: {
    public_id: {
      type: String,
      default: 'falta'
    },
    url: {
      type: String,
      default: 'https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png'
    }
  },
  estado: {
    type: Boolean,
    default: true
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: true
  },
  descripcionComprobante: [{
    type: Schema.Types.ObjectId,
    ref: 'DescripcionComprobante',
    required: true
  }],
  moneda: {
    type: String,
    required: true,
    enum: ['Soles', 'Dolares']
  },
  tipoCambio: {
    type: Number,
    required: function () { return this.moneda === 'Dolares'; },
    min: 0
  },
  totalRendicion: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  registradoPor: {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaModificacion: {
    type: Date,
    default: Date.now
  }
});

// Middleware para establecer moneda y tipoCambio en cada item de descripcionComprobante
RendicionCuentaSchema.pre('save', async function(next) {
  this.fechaModificacion = Date.now();
  const descripcionComprobanteDocs = await mongoose.model('DescripcionComprobante').find({ _id: { $in: this.descripcionComprobante } });
  descripcionComprobanteDocs.forEach(item => {
    item.moneda = this.moneda;
    item.tipoCambio = this.tipoCambio;
    item.costoTotal = item.cantidad * item.precioUnitario;
    item.save();
  });
  this.totalRendicion = descripcionComprobanteDocs.reduce((acc, item) => acc + item.costoTotal, 0);
  next();
});

module.exports = mongoose.model('RendicionCuenta', RendicionCuentaSchema);
