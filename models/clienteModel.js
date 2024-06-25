const mongoose = require('mongoose');
const { Schema } = mongoose;

const clienteSchema = new Schema({
  rucDni: {
    type: String,
    required: [true, 'El RUC/DNI es obligatorio'],
    trim: true,
    unique: true
  },
  nombreComercial: {
    type: String,
    required: [true, 'El nombre comercial es obligatorio'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  direccionEntrega: {
    type: String,
    required: [true, 'La dirección de entrega es obligatoria'],
    trim: true
  },
  nombreContacto: {
    type: String,
    required: [true, 'El nombre de contacto es obligatorio'],
    trim: true
  },
  correoContacto: {
    type: String,
    required: [true, 'El correo de contacto es obligatorio'],
    trim: true,
    match: [/.+\@.+\..+/, 'Por favor ingrese un correo válido']
  },
  nroContacto: {
    type: String,
    required: [true, 'El número de contacto es obligatorio'],
    trim: true
  },
  registradoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario que registra es obligatorio']
  },
  historialPedidos: [{
    type: Schema.Types.ObjectId,
    ref: 'OrdenServicio'
  }],
  notas: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Campo virtual para contar el número total de órdenes de servicio
clienteSchema.virtual('totalOrdenesServicio').get(function() {
  return this.historialPedidos.length;
});

// Método para agregar una orden de servicio al historial del cliente
clienteSchema.methods.agregarOrdenServicio = function(ordenId) {
  this.historialPedidos.push(ordenId);
  return this.save();
};

module.exports = mongoose.model('Cliente', clienteSchema);
