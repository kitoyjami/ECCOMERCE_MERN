const mongoose = require('mongoose');
const { Schema } = mongoose;

const DescripcionComprobanteSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId, 
    ref: 'ProductoCrs', 
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
    required: true, 
    min: 0,
    default: function() {
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
  }
});

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
      default: 'falta' // Establece aquí el valor predeterminado para 'public_id'
    },
    url: {
      type: String,
      default: 'https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png' // Establece aquí el valor predeterminado para 'url'
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
  descripcionComprobante: [DescripcionComprobanteSchema],
  moneda: {
    type: String,
    required: true,
    enum: ['Soles', 'Dolares']
  },
  tipoCambio: {
    type: Number,
    required: function() { return this.moneda === 'Dolares'; },
    min: 0
  },
  subTotal: { 
    type: Number, 
    required: true, 
    min: 0,
    default: 0 
  },
  agregarIGV: { 
    type: Boolean, 
    default: false
  },
  totalRendicion: { 
    type: Number, 
    required: true,
    min: 0,
    default: function() { 
      return this.agregarIGV ? this.subTotal * 1.18 : this.subTotal;
    }
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

// Middleware para calcular el costoTotal, subTotal y totalRendicion, y actualizar fecha de modificación
RendicionCuentaSchema.pre('save', function(next) {
  this.fechaModificacion = Date.now();
  this.descripcionComprobante.forEach(item => {
    item.costoTotal = item.cantidad * item.precioUnitario;
  });
  this.subTotal = this.descripcionComprobante.reduce((acc, item) => acc + item.costoTotal, 0);
  this.totalRendicion = this.agregarIGV ? this.subTotal * 1.18 : this.subTotal;
  next();
});

module.exports = mongoose.model('RendicionCuenta', RendicionCuentaSchema);
