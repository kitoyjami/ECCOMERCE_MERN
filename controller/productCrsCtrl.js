const ProductoCrs = require('../models/productCrsModel');

// Obtener un producto por su ID con populate en las referencias
const getProductoById = async (req, res) => {
    try {
        const producto = await ProductoCrs.findById(req.params.id)
            .populate('tipo')
            .populate('unidadesMedida');
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un producto por su ID
const updateProducto = async (req, res) => {
    try {
        const producto = await ProductoCrs.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los productos con populate en las referencias
const getProductos = async (req, res) => {
    try {
        const productos = await ProductoCrs.find()
            .populate('tipo')
            .populate('unidadesMedida');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
    const nuevoProducto = new ProductoCrs(req.body);
    try {
        const producto = await nuevoProducto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un producto por su ID
const deleteProducto = async (req, res) => {
    try {
        const producto = await ProductoCrs.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
};






