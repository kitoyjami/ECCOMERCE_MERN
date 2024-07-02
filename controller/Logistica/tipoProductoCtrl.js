const TipoProducto = require('../../models/Logistica/tipoProductoModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../../utils/validateMongodbid');

const createTipoProducto = asyncHandler(async (req, res) => {
    try {
        const newTipoProducto = await TipoProducto.create(req.body);
        res.json(newTipoProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const updateTipoProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const tipoProducto = await TipoProducto.findById(id);
        if (!tipoProducto) {
            res.status(404);
            throw new Error("Tipo de Producto no encontrado");
        }

        const updatedTipoProducto = await TipoProducto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        res.json({
            message: "Tipo de Producto actualizado correctamente",
            data: updatedTipoProducto
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Error al actualizar el Tipo de Producto: ${error.message}`);
    }
});

const deleteTipoProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedTipoProducto = await TipoProducto.findByIdAndDelete(id);
        res.json(deletedTipoProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const getTipoProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const tipoProducto = await TipoProducto.findById(id);
        res.json(tipoProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllTiposProducto = asyncHandler(async (req, res) => {
    try {
        const tiposProducto = await TipoProducto.find();
        res.json(tiposProducto);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createTipoProducto,
    updateTipoProducto,
    deleteTipoProducto,
    getTipoProducto,
    getAllTiposProducto
};
