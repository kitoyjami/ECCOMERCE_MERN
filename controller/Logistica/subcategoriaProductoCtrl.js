const SubcategoriaProducto = require('../../models/Logistica/subcategoProductoModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../../utils/validateMongodbid');

const createSubcategoriaProducto = asyncHandler(async (req, res) => {
    try {
        const newSubcategoriaProducto = await SubcategoriaProducto.create(req.body);
        res.json(newSubcategoriaProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const updateSubcategoriaProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedSubcategoriaProducto = await SubcategoriaProducto.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedSubcategoriaProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteSubcategoriaProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedSubcategoriaProducto = await SubcategoriaProducto.findByIdAndDelete(id);
        res.json(deletedSubcategoriaProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const getSubcategoriaProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const subcategoriaProducto = await SubcategoriaProducto.findById(id);
        res.json(subcategoriaProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllSubcategoriasProducto = asyncHandler(async (req, res) => {
    try {
        const subcategoriasProducto = await SubcategoriaProducto.find();
        res.json(subcategoriasProducto);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createSubcategoriaProducto,
    updateSubcategoriaProducto,
    deleteSubcategoriaProducto,
    getSubcategoriaProducto,
    getAllSubcategoriasProducto
};
