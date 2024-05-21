const asyncHandler = require('express-async-handler');
const DailyReport = require('../models/partediarioModel');
const Attendance = require('../models/attendanceModel');
const Service = require('../models/servicioModel');


const generateDailyReport = async (req, res) => {
    try {
        const { fecha } = req.body; // Suponiendo que la fecha viene en el cuerpo de la solicitud

        // Buscar todas las asistencias registradas en la fecha especificada
        const attendances = await Attendance.find({ horaEntrada: { $gte: new Date(fecha).setHours(0, 0, 0, 0) } }).populate('trabajador servicio');
        console.log(attendances[0].servicio._id)
        // Agrupar asistencias por servicio
        const attendanceByService = {};
        attendances.forEach(attendance => {
          if (attendance.servicio && attendance.servicio._id) {
              const { servicio } = attendance;
              if (!attendanceByService[servicio._id]) {
                  attendanceByService[servicio._id] = [];
              }
              attendanceByService[servicio._id].push(attendance);
          }
      });

        // Calcular las horas trabajadas por servicio
        const dailyReportData = {};
        for (const servicioId in attendanceByService) {
            const service = await Service.findById(servicioId);
            const asistencias = attendanceByService[servicioId];
            let totalHorasTrabajadas = 0;
            asistencias.forEach(attendance => {
                totalHorasTrabajadas += attendance.duracionJornada;
            });
            dailyReportData[service.nombre] = {
                asistencias,
                totalHorasTrabajadas
            };
        }

        // Crear el parte diario
        const dailyReport = new DailyReport({
            fecha: new Date(fecha),
            data: dailyReportData
        });

        // Guardar el parte diario en la base de datos
        await dailyReport.save();

        // Responder con el parte diario generado
        res.status(200).json(dailyReport);
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el parte diario', error: error.message });
    }
};


const getDailyReportByDate = asyncHandler(async (req, res) => {
    const { fecha } = req.params;
  
    const report = await DailyReport.findOne({ fecha }).populate('asistenciasPorServicio.servicio asistenciasPorServicio.asistencias');
  
    if (!report) {
      return res.status(404).json({ message: 'Reporte diario no encontrado para la fecha especificada.' });
    }
  
    res.status(200).json(report);
  });
  

const getAllDailyReports = asyncHandler(async (req, res) => {
    const reports = await DailyReport.find().populate('asistenciasPorServicio.servicio asistenciasPorServicio.asistencias');
  
    res.status(200).json(reports);
  });
  

const updateDailyReport = asyncHandler(async (req, res) => {
    const { fecha } = req.params;
    const { asistenciasPorServicio } = req.body;
  
    const report = await DailyReport.findOne({ fecha });
  
    if (!report) {
      return res.status(404).json({ message: 'Reporte diario no encontrado para la fecha especificada.' });
    }
  
    // Calcular los nuevos totales
    let totalHorasEmpresa = 0;
    let totalHorasHombreEmpresa = 0;
  
    for (const servicioAsistencia of asistenciasPorServicio) {
      const { servicio, asistencias } = servicioAsistencia;
  
      let totalHorasServicio = 0;
      let totalHorasHombreServicio = 0;
  
      for (const asistenciaId of asistencias) {
        const asistencia = await Attendance.findById(asistenciaId);
  
        if (asistencia) {
          const duracion = (asistencia.horaSalida - asistencia.horaEntrada) / 1000 / 60; // Duración en minutos
          totalHorasServicio += duracion;
          totalHorasHombreServicio += duracion; // Ajusta esto si es diferente
        }
      }
  
      servicioAsistencia.totalHorasServicio = totalHorasServicio;
      servicioAsistencia.totalHorasHombreServicio = totalHorasHombreServicio;
  
      totalHorasEmpresa += totalHorasServicio;
      totalHorasHombreEmpresa += totalHorasHombreServicio;
    }
  
    report.asistenciasPorServicio = asistenciasPorServicio;
    report.totalHorasEmpresa = totalHorasEmpresa;
    report.totalHorasHombreEmpresa = totalHorasHombreEmpresa;
  
    await report.save();
    res.status(200).json(report);
  });
  

const deleteDailyReport = asyncHandler(async (req, res) => {
    const { fecha } = req.params;
  
    const report = await DailyReport.findOneAndDelete({ fecha });
  
    if (!report) {
      return res.status(404).json({ message: 'Reporte diario no encontrado para la fecha especificada.' });
    }
  
    res.status(200).json({ message: 'Reporte diario eliminado con éxito.' });
  });
  

module.exports = {
  generateDailyReport,
  getAllDailyReports,
  getDailyReportByDate,
  deleteDailyReport,
  updateDailyReport
};
