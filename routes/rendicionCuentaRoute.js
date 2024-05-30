const express = require("express")
const { 
    createRendicionCuenta,
    getAllRendicionesCuenta,
    getRendicionCuentaById,
    updateRendicionCuenta,
    deleteRendicionCuenta} = require("../controller/rendicionCuentaCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createRendicionCuenta)
router.put('/:id',authMiddleware,isAdmin,updateRendicionCuenta)
router.delete('/:id',authMiddleware,isAdmin,deleteRendicionCuenta)
router.get('/:id',getRendicionCuentaById)
router.get('/',getAllRendicionesCuenta)

module.exports=router