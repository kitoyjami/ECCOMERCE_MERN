const Producto = require('../../models/Logistica/productoModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../../utils/validateMongodbid');

const createProducto = asyncHandler(async (req, res) => {
    try {
        const newProducto = await Producto.create(req.body);
        res.json(newProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedProducto = await Producto.findByIdAndUpdate(id, req.body, { new: true }).populate('tipo categoria subcategoria unidadesMedida');
        res.json(updatedProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedProducto = await Producto.findByIdAndDelete(id);
        res.json(deletedProducto);
    } catch (error) {
        throw new Error(error);
    }
});

const getProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const producto = await Producto.findById(id).populate('tipo categoria subcategoria unidadesMedida');
        res.json(producto);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProductos = asyncHandler(async (req, res) => {
    try {
        const productos = await Producto.find().populate('tipo categoria subcategoria unidadesMedida');
        res.json(productos);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProducto,
    updateProducto,
    deleteProducto,
    getProducto,
    getAllProductos
};
