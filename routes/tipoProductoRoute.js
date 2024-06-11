const express = require("express")
const { 
    getAllTiposProducto,
    getTipoProductoById ,
    createTipoProducto ,
    updateTipoProducto ,
    deleteTipoProducto,
    eliminarIndiceUnico} = require("../controller/tipoProductoCtrls")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createTipoProducto)
router.post('/eliminar-indice-unico',authMiddleware,isAdmin,eliminarIndiceUnico)
router.put('/:id',authMiddleware,isAdmin,updateTipoProducto)
router.delete('/:id',authMiddleware,isAdmin,deleteTipoProducto)
router.get('/:id',getTipoProductoById)
router.get('/',getAllTiposProducto)

module.exports=router
