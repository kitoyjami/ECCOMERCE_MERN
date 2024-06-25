const mongoose = require('mongoose');
const { Schema } = mongoose;

const tipoTareaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del tipo de tarea es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre del tipo de tarea debe tener al menos 3 caracteres'],
    maxlength: [100, 'El nombre del tipo de tarea no puede exceder los 100 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for fast search by nombre
tipoTareaSchema.index({ nombre: 1 });

module.exports = mongoose.model('TipoTarea', tipoTareaSchema);
