const ServicioTercero = require('../models/servicioTerceroModel');

// Obtener un producto por su ID con populate en las referencias
const getServicioTerceroById = async (req, res) => {
    try {
        const servicioTercero = await ServicioTercero.findById(req.params.id)
            .populate('tipo')
            .populate('unidadesMedida');
        if (!servicioTercero) {
            return res.status(404).json({ message: 'Servicio de tercero no encontrado' });
        }
        res.json(servicioTercero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un producto por su ID
const updateServicioTercero = async (req, res) => {
    try {
        const servicioTercero = await ServicioTercero.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!servicioTercero) {
            return res.status(404).json({ message: 'Servicio de tercero no encontrado' });
        }
        res.json(servicioTercero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los productos con populate en las referencias
const getServicioTeceros = async (req, res) => {
    try {
        const servicioTerceros = await ServicioTercero.find()
            .populate('tipo')
            .populate('unidadesMedida');
        res.json(servicioTerceros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo producto
const createServicioTercero = async (req, res) => {
    const nuevoServicioTercero = new ServicioTercero(req.body);
    try {
        const servicioTercero = await nuevoServicioTercero.save();
        res.status(201).json(servicioTercero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un producto por su ID
const deleteServicioTercero = async (req, res) => {
    try {
        const servicioTercero = await ServicioTercero.findByIdAndDelete(req.params.id);
        if (!servicioTercero) {
            return res.status(404).json({ message: 'Servicio de tercero no encontrado' });
        }
        res.json({ message: 'Servcio de tercero eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getServicioTeceros,
    getServicioTerceroById,
    createServicioTercero,
    updateServicioTercero,
    deleteServicioTercero
};


