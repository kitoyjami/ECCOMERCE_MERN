const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  trabajador: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  servicio: {
    type: Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  horaEntrada: {
    type: Date,
    required: true
  },
  horaSalida: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > this.horaEntrada;
      },
      message: 'La hora de salida debe ser posterior a la hora de entrada'
    }
  },
  ubicacionEntrada: {
    type: String // Puedes cambiar esto para usar geolocalización si es necesario
  },
  ubicacionSalida: {
    type: String // Puedes cambiar esto para usar geolocalización si es necesario
  },
  estado: {
    type: String,
    enum: ['A tiempo', 'Tarde', 'Temprano'],
    default: 'A tiempo'
  },
  aprobado: {
    type: Boolean,
    default: false
  },
  notas: {
    type: String
  },
  duracionJornada: {
    type: Number, // Duración en minutos u horas
    default: function() {
      if (this.horaEntrada && this.horaSalida) {
        return (this.horaSalida - this.horaEntrada) / 1000 / 60; // Ejemplo en minutos
      }
      return 0;
    }
  },
  tipoJornada: {
    type: String,
    enum: ['Jornada completa', 'Media jornada', 'Otro'],
    default: 'Jornada completa'
  },
  pausas: [{
    inicio: Date,
    fin: Date,
    duracion: Number // Duración en minutos
  }],
  historialModificaciones: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    cambios: {
      type: String
    },
    modificadoPor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  registradoPor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
