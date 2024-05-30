const TipoServicioTercero = require('../models/tipoServicioTerceModel');

// Controlador para obtener todas las unidades de medida
const getAllTipoServicioTercero = async (req, res) => {
    try {
        const tipoServicioTercero = await TipoServicioTercero.find();
        res.json(tipoServicioTercero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener una unidad de medida por su ID
const getTipoServicioTerceroById = async (req, res) => {
    try {
        const tipoServicioTercero = await TipoServicioTercero.findById(req.params.id);
        if (!tipoServicioTercero) {
            return res.status(404).json({ message: 'Tipo servicio tercero no encontrado' });
        }
        res.json(tipoServicioTercero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para crear una nueva unidad de medida
const createTipoServicioTercero = async (req, res) => {
    try {
        const nuevaTipoServicioTercero  = await TipoServicioTercero.create(req.body)
        res.status(201).json(nuevaTipoServicioTercero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar una unidad de medida
const updateTipoServicioTercero = async (req, res) => {
    try {
        const tipoServicioTercero = await TipoServicioTercero.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tipoServicioTercero) {
            return res.status(404).json({ message: 'Tipo servicio tercero no encontrado' });
        }
        res.json(tipoServicioTercero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar una unidad de medida
const deleteTipoServicioTercero = async (req, res) => {
    try {
        const tipoServicioTercero = await TipoServicioTercero.findByIdAndDelete(req.params.id);
        if (!tipoServicioTercero) {
            return res.status(404).json({ message: 'Tipo servicio tercero no encontrado'});
        }
        res.json({ message: 'Tipo servicio tercero eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllTipoServicioTercero ,
    getTipoServicioTerceroById ,
    createTipoServicioTercero ,
    updateTipoServicioTercero ,
    deleteTipoServicioTercero
};
