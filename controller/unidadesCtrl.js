const UnidadMedida = require('../models/unidadesMode');

// Controlador para obtener todas las unidades de medida
const getAllUnidadesMedida = async (req, res) => {
    try {
        const unidadesMedida = await UnidadMedida.find();
        res.json(unidadesMedida);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener una unidad de medida por su ID
const getUnidadMedidaById = async (req, res) => {
    try {
        const unidadMedida = await UnidadMedida.findById(req.params.id);
        if (!unidadMedida) {
            return res.status(404).json({ message: 'Unidad de medida no encontrada' });
        }
        res.json(unidadMedida);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para crear una nueva unidad de medida
const createUnidadMedida = async (req, res) => {
    try {
        const nuevaUnidadMedida  = await UnidadMedida.create(req.body)
        res.status(201).json(nuevaUnidadMedida);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar una unidad de medida
const updateUnidadMedida = async (req, res) => {
    try {
        const unidadMedida = await UnidadMedida.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!unidadMedida) {
            return res.status(404).json({ message: 'Unidad de medida no encontrada' });
        }
        res.json(unidadMedida);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar una unidad de medida
const deleteUnidadMedida = async (req, res) => {
    try {
        const unidadMedida = await UnidadMedida.findByIdAndDelete(req.params.id);
        if (!unidadMedida) {
            return res.status(404).json({ message: 'Unidad de medida no encontrada' });
        }
        res.json({ message: 'Unidad de medida eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllUnidadesMedida,
    getUnidadMedidaById ,
    createUnidadMedida ,
    updateUnidadMedida ,
    deleteUnidadMedida
};
