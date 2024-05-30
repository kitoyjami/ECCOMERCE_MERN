const TipoProducto = require('../models/tipoProductoModel');

// Controlador para obtener todas las unidades de medida
const getAllTiposProducto = async (req, res) => {
    try {
        const tipoProducto = await TipoProducto.find();
        res.json(tipoProducto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener una unidad de medida por su ID
const getTipoProductoById = async (req, res) => {
    try {
        const tipoProducto = await TipoProducto.findById(req.params.id);
        if (!tipoProducto) {
            return res.status(404).json({ message: 'Tipo de producto no encontrada' });
        }
        res.json(tipoProducto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para crear una nueva unidad de medida
const createTipoProducto = async (req, res) => {
    try {
        const nuevoTipoProducto  = await TipoProducto.create(req.body)
        res.status(201).json(nuevoTipoProducto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar una unidad de medida
const updateTipoProducto = async (req, res) => {
    try {
        const tipoProducto = await TipoProducto.findById(req.params.id);
        if (!tipoProducto) {
            return res.status(404).json({ message: 'Tipo de producto no encontrado' });
        }

        // Verificar si la subcategoría ya existe
        const subcategoriaExistente = tipoProducto.subcategoria.find(subcat => subcat === req.body.subcategoria);
        if (subcategoriaExistente) {
            return res.status(400).json({ message: 'La subcategoría ya existe en el tipo de producto' });
        }

        // Si no existe, agregar la nueva subcategoría al array
        tipoProducto.subcategoria.push(req.body.subcategoria);

        // Guardar el tipo de producto actualizado
        const tipoProductoActualizado = await tipoProducto.save();

        res.json(tipoProductoActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Controlador para eliminar una unidad de medida
const deleteTipoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { subcategoria } = req.body;

        // Si se proporciona una subcategoría en el cuerpo de la solicitud
        if (subcategoria) {
            const tipoProducto = await TipoProducto.findById(id);
            if (!tipoProducto) {
                return res.status(404).json({ message: 'Tipo de producto no encontrado' });
            }

            // Filtrar las subcategorías para eliminar la que coincide con la proporcionada
            tipoProducto.subcategoria = tipoProducto.subcategoria.filter(subcat => subcat !== subcategoria);
            await tipoProducto.save();

            return res.json({ message: 'Subcategoría eliminada correctamente' });
        }

        // Si no se proporciona una subcategoría, eliminar todo el tipo de producto
        const tipoProductoEliminado = await TipoProducto.findByIdAndDelete(id);
        if (!tipoProductoEliminado) {
            return res.status(404).json({ message: 'Tipo de producto no encontrado' });
        }
        
        res.json({ message: 'Tipo de producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllTiposProducto,
    getTipoProductoById ,
    createTipoProducto ,
    updateTipoProducto ,
    deleteTipoProducto
};
