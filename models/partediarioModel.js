const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const asistenciaPorServicioSchema = new Schema({
  servicio: {
    type: Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  asistencias: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  totalHorasServicio: {
    type: Number,
    default: 0 // Total de horas trabajadas para este servicio
  },
  totalHorasHombreServicio: {
    type: Number,
    default: 0 // Total de horas hombre trabajadas para este servicio
  }
});

const dailyReportSchema = new Schema({
  fecha: {
    type: Date,
    required: true,
    unique: true
  },
  asistenciasPorServicio: [asistenciaPorServicioSchema],
  totalHorasEmpresa: {
    type: Number,
    default: 0 // Total de horas trabajadas en la empresa
  },
  totalHorasHombreEmpresa: {
    type: Number,
    default: 0 // Total de horas hombre trabajadas en la empresa
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailyReport', dailyReportSchema);
