const mongoose = require('mongoose');
const { Schema } = mongoose;

const caracteristicaSchema = new Schema({
  unidadMedida: {
    type: Schema.Types.ObjectId,
    ref: 'UnidadMedida',
    required: [true, 'La unidad de medida es obligatoria']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [0, 'La cantidad no puede ser negativa']
  }
});

const tareaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la tarea es obligatorio']
  },
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha de inicio de la tarea es obligatoria']
  },
  fechaFin: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= this.fechaInicio;
      },
      message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio'
    }
  },
  tipoTarea: {
    type: Schema.Types.ObjectId,
    ref: 'TipoTarea',
    required: true
  },
  horasMaquina: {
    type: Number,
    min: [0, 'Las horas de máquina no pueden ser negativas']
  },
  asistenciaTrabajo: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  totalHorasHombre: {
    type: Number,
    default: 0,
    min: [0, 'El total de horas hombre no puede ser negativo']
  },
  caracteristicas: [caracteristicaSchema]
});

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
  horasHombreProyectadas: {
    type: Number,
    required: [true, 'Las horas hombre proyectadas son obligatorias'],
    min: [0, 'Las horas hombre proyectadas no pueden ser negativas']
  },
  totalHorasTrabajadas: {
    type: Number,
    default: 0,
    min: [0, 'El total de horas trabajadas no puede ser negativo']
  },
  tareas: [tareaSchema],
  caracteristicas: [caracteristicaSchema],
  supervisoresAsignados: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  asistenciaTrabajo: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  registroGastos: [{
    type: Schema.Types.ObjectId,
    ref: 'DescripcionComprobante'
  }],
  totalGastadoSoles: {
    type: Number,
    default: 0,
    min: [0, 'El total gastado en soles no puede ser negativo']
  },
  totalGastadoDolares: {
    type: Number,
    default: 0,
    min: [0, 'El total gastado en dólares no puede ser negativo']
  },
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
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria']
  },
  fechaFin: {
    type: Date,
    validate: {
      validator: function(value) {
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

servicioSchema.virtual('costoTotal').get(function() {
  return this.costoEstimado + this.totalGastado;
});

servicioSchema.pre('save', async function(next) {
  if (this.isModified('asistenciaTrabajo')) {
    const asistenciaDocs = await mongoose.model('Attendance').find({ _id: { $in: this.asistenciaTrabajo } });
    this.totalHorasTrabajadas = asistenciaDocs.reduce((sum, doc) => sum + doc.duracionJornada, 0);
  }

  if (this.isModified('tareas')) {
    for (let tarea of this.tareas) {
      if (tarea.isModified('asistenciaTrabajo')) {
        const asistenciaTareaDocs = await mongoose.model('Attendance').find({ _id: { $in: tarea.asistenciaTrabajo }, servicio: this._id });
        tarea.totalHorasHombre = asistenciaTareaDocs.reduce((sum, doc) => sum + doc.duracionJornada, 0);
      }
    }
  }

  if (this.isModified('registroGastos')) {
    const descripcionComprobanteDocs = await mongoose.model('DescripcionComprobante').find({ _id: { $in: this.registroGastos } });
    this.totalGastadoSoles = descripcionComprobanteDocs.filter(doc => doc.moneda === 'Soles').reduce((sum, doc) => sum + doc.costoTotal, 0);
    this.totalGastadoDolares = descripcionComprobanteDocs.filter(doc => doc.moneda === 'Dolares').reduce((sum, doc) => sum + (doc.costoTotal * doc.tipoCambio), 0);
    this.totalGastado = this.totalGastadoSoles + this.totalGastadoDolares;
  }

  next();
});

servicioSchema.index({ nombre: 1 });

module.exports = mongoose.model('Servicio', servicioSchema);
