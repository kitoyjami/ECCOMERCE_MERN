const express = require("express")
const { 
    getAllUnidadesMedida,
getUnidadMedidaById ,
createUnidadMedida ,
updateUnidadMedida ,
deleteUnidadMedida} = require("../controller/unidadesCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createUnidadMedida)
router.put('/:id',authMiddleware,isAdmin,updateUnidadMedida)
router.delete('/:id',authMiddleware,isAdmin,deleteUnidadMedida)
router.get('/:id',getUnidadMedidaById)
router.get('/',getAllUnidadesMedida)

module.exports=router

