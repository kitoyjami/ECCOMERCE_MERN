const express = require("express")
const { 
    getServicioTeceros,
    getServicioTerceroById,
    createServicioTercero,
    updateServicioTercero,
    deleteServicioTercero} = require("../controller/servicioTerceroCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createServicioTercero)
router.put('/:id',authMiddleware,isAdmin,updateServicioTercero)
router.delete('/:id',authMiddleware,isAdmin,deleteServicioTercero)
router.get('/:id',getServicioTerceroById)
router.get('/',getServicioTeceros)

module.exports=router
