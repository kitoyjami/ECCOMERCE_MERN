// models/ordenDeServicioModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Counter = require('./counterModel');

const ordenDeServicioSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'],
    default: 'Pendiente'
  },
  serviciosAsignados: [{
    type: Schema.Types.ObjectId,
    ref: 'Servicio'
  }],
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  registradoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  codigoInterno: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Middleware para generar el código interno antes de guardar
ordenDeServicioSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'ordenServicioId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.codigoInterno = `CRS-OS-${counter.seq}`;
  }
  next();
});

module.exports = mongoose.model('OrdenDeServicio', ordenDeServicioSchema);
