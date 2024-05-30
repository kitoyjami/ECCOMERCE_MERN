const Proveedor = require('../models/proveedorModel');
const asyncHandler=require('express-async-handler')

// Crear un nuevo proveedor
const createProveedor = asyncHandler(
        async (req, res) => {
            try {
                const { rucDni, nombreComercial, estado, tiposProducto, tiposServicio, direccion, nroContacto } = req.body;
                
                // Crear un nuevo proveedor con los datos del cuerpo de la solicitud y el usuario autenticado
                const nuevoProveedor = new Proveedor({
                    rucDni,
                    nombreComercial,
                    estado,
                    tiposProducto,
                    tiposServicio,
                    direccion,
                    nroContacto,
                    registradoPor: { user: req.user._id }
                });
                
                // Guardar el proveedor en la base de datos
                const proveedorGuardado = await nuevoProveedor.save();
                
                res.status(201).json(proveedorGuardado);
            } catch (error) {
                res.status(500).json({ message: 'Error al crear el proveedor', error });
            }
        }
) 

// Obtener todos los proveedores
const getProveedores = asyncHandler (
        async (req, res) => {
            try {
                const proveedores = await Proveedor.find().populate('tiposProducto').populate('tiposServicio').populate('registradoPor.user');
                res.status(200).json(proveedores);
            } catch (error) {
                res.status(500).json({ message: 'Error al obtener los proveedores', error });
            }
        }
        )


// Obtener un proveedor por ID
const getProveedorById = asyncHandler (
        async (req, res) => {
            try {
                const proveedor = await Proveedor.findById(req.params.id).populate('tiposProducto').populate('tiposServicio').populate('registradoPor.user');
                if (!proveedor) {
                    return res.status(404).json({ message: 'Proveedor no encontrado' });
                }
                res.status(200).json(proveedor);
            } catch (error) {
                res.status(500).json({ message: 'Error al obtener el proveedor', error });
            }
        }
    )


// Actualizar un proveedor por ID
const updateProveedor =asyncHandler(
        async (req, res) => {
            try {
                const { rucDni, nombreComercial, estado, tiposProducto, tiposServicio, direccion, nroContacto } = req.body;
        
                const proveedorActualizado = await Proveedor.findByIdAndUpdate(
                    req.params.id,
                    {
                        rucDni,
                        nombreComercial,
                        estado,
                        tiposProducto,
                        tiposServicio,
                        direccion,
                        nroContacto,
                        registradoPor: { user: req.user._id }
                    },
                    { new: true }
                ).populate('tiposProducto').populate('tiposServicio').populate('registradoPor.user');
                
                if (!proveedorActualizado) {
                    return res.status(404).json({ message: 'Proveedor no encontrado' });
                }
        
                res.status(200).json(proveedorActualizado);
            } catch (error) {
                res.status(500).json({ message: 'Error al actualizar el proveedor', error });
            }
        }
)


// Eliminar un proveedor por ID
const deleteProveedor = asyncHandler(
        async (req, res) => {
            try {
                const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);
                if (!proveedorEliminado) {
                    return res.status(404).json({ message: 'Proveedor no encontrado' });
                }
                res.status(200).json({ message: 'Proveedor eliminado correctamente' });
            } catch (error) {
                res.status(500).json({ message: 'Error al eliminar el proveedor', error });
            }
        }
)




module.exports={
    createProveedor,
    getProveedores,
    getProveedorById,
    updateProveedor,
    deleteProveedor
}
