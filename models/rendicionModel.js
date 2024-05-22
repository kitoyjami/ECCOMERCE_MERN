const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  descripcion: {
    type: String,
    required: [true, 'La descripción del gasto es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
  },
  monto: {
    type: Number,
    required: [true, 'El monto del gasto es obligatorio'],
    min: [0, 'El monto del gasto no puede ser negativo']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha del gasto es obligatoria']
  },
  registradoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario que registra es obligatorio']
  },
  servicio: {
    type: Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
