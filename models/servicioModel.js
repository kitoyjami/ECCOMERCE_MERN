const mongoose = require('mongoose');
const { Schema } = mongoose;

const servicioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre del servicio debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre del servicio no puede exceder los 100 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
  },
  costoEstimado: {
    type: Number,
    required: [true, 'El costo estimado es obligatorio'],
    min: [0, 'El costo estimado no puede ser negativo']
  },
  totalHorasTrabajadas: {
    type: Number,
    default: 0,
    min: [0, 'El total de horas trabajadas no puede ser negativo']
  },
  asistenciaTrabajo: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  registroGastos: [{
    producto: {
      type: Schema.Types.ObjectId,
      ref: 'ProductoCrs',
      required: true
    },
    rendicionCuenta: {
      type: Schema.Types.ObjectId,
      ref: 'RendicionCuenta',
      required: true
    }
  }],
  totalGastado: {
    type: Number,
    default: 0,
    min: [0, 'El total gastado no puede ser negativo']
  },
  registradoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario que registra es obligatorio']
  },
  caracteristicas: [{
    tipo: {
      type: String,
      enum: ['kg', 'metros', 'metros lineales', 'metros cuadrados', 'unidades'],
      required: [true, 'El tipo de característica es obligatorio']
    },
    valor: {
      type: Number,
      required: [true, 'El valor de la característica es obligatorio'],
      min: [0, 'El valor de la característica no puede ser negativo']
    }
  }],
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria']
  },
  fechaFin: {
    type: Date,
    validate: {
      validator: function(value) {
        // La fecha de fin debe ser mayor o igual a la fecha de inicio
        return !value || value >= this.fechaInicio;
      },
      message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio'
    }
  },
  numeroOrdenCompra: {
    type: String,
    trim: true
  },
  fechaAprobacionOrdenCompra: {
    type: Date
  },
  nombreCliente: {
    type: String,
    trim: true
  },
  ubicacion: {
    type: String,
    trim: true
  },
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for calculating total costs
servicioSchema.virtual('costoTotal').get(function() {
  return this.costoEstimado + this.totalGastado;
});

// Middleware to update totalHorasTrabajadas when asistenciaTrabajo is updated
servicioSchema.pre('save', async function(next) {
  if (this.isModified('asistenciaTrabajo')) {
    const asistenciaDocs = await mongoose.model('Attendance').find({ _id: { $in: this.asistenciaTrabajo } });
    this.totalHorasTrabajadas = asistenciaDocs.reduce((sum, doc) => sum + doc.duracionJornada, 0);
  }
  next();
});

// Index for fast search by nombre
servicioSchema.index({ nombre: 1 });

module.exports = mongoose.model('Servicio', servicioSchema);
