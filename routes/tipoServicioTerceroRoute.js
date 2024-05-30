const express = require("express")
const { 
    getAllTipoServicioTercero ,
    getTipoServicioTerceroById ,
    createTipoServicioTercero ,
    updateTipoServicioTercero ,
    deleteTipoServicioTercero} = require("../controller/tipoServicioTerCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createTipoServicioTercero)
router.put('/:id',authMiddleware,isAdmin,updateTipoServicioTercero)
router.delete('/:id',authMiddleware,isAdmin,deleteTipoServicioTercero)
router.get('/:id',getTipoServicioTerceroById)
router.get('/',getAllTipoServicioTercero)

module.exports=router
