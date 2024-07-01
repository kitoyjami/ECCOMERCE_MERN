const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: String,
    tipo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TipoDProducto' 
    }, // Referencia al tipo de producto
    categoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CategoriaProducto' 
    }, // Referencia a la categoría dentro del tipo
    subcategoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SubcategoriaProducto' 
    }, // Referencia a la subcategoría dentro de la categoría
    detalles: String, // Detalles adicionales del producto
    especificaciones: { 
        type: Map, of: mongoose.Schema.Types.Mixed 
    }, // Propiedades específicas adicionales
    unidadesMedida: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'UnidadMedida'
        }
    ] // Referencia a las unidades de medida

});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
