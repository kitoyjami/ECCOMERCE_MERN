const express = require("express")
const { 
    createTipoGasto,
  getAllTiposGasto,
  getTipoGastoById,
  updateTipoGasto,
  deleteTipoGasto} = require("../controller/tipoGastoCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createTipoGasto)
router.put('/:id',authMiddleware,isAdmin,updateTipoGasto)
router.delete('/:id',authMiddleware,isAdmin,deleteTipoGasto)
router.get('/:id',getTipoGastoById)
router.get('/',getAllTiposGasto)

module.exports=router