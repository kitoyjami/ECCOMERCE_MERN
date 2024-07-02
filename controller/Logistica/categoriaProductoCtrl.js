const CategoriaProducto = require('../../models/Logistica/categoriaProductoModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../../utils/validateMongodbid');

const createCategoriaProducto = asyncHandler(async (req, res) => {
    try {
        const newCategoriaProducto = await CategoriaProducto.create(req.body);
        res.json(newCategoriaProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategoriaProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedCategoriaProducto = await CategoriaProducto.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCategoriaProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCategoriaProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategoriaProducto = await CategoriaProducto.findByIdAndDelete(id);
        res.json(deletedCategoriaProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const getCategoriaProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const categoriaProducto = await CategoriaProducto.findById(id).populate('tipo');
        res.json(categoriaProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllCategoriasProducto = asyncHandler(async (req, res) => {
    try {
        const categoriasProducto = await CategoriaProducto.find().populate('tipo');
        res.json(categoriasProducto);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCategoriaProducto,
    updateCategoriaProducto,
    deleteCategoriaProducto,
    getCategoriaProducto,
    getAllCategoriasProducto
};
