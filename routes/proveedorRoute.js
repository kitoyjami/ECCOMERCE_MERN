const express = require("express")
const { 
    createProveedor,
    getProveedores,
    getProveedorById,
    updateProveedor,
    deleteProveedor} = require("../controller/proveedorCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createProveedor)
router.put('/:id',authMiddleware,isAdmin,updateProveedor)
router.delete('/:id',authMiddleware,isAdmin,deleteProveedor)
router.get('/:id',getProveedorById)
router.get('/',getProveedores)

module.exports=router