const express = require("express")
const { 
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto} = require("../controller/productCrsCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createProducto)
router.put('/:id',authMiddleware,isAdmin,updateProducto)
router.delete('/:id',authMiddleware,isAdmin,deleteProducto)
router.get('/:id',getProductoById)
router.get('/',getProductos)

module.exports=router