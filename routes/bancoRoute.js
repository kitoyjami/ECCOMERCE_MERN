const express = require("express")
const { 
    createBanco, 
    updateBanco, 
    deleteBanco, 
    getBanco,
    getAllBanco} = require("../controller/bancoCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createBanco)
router.put('/:id',authMiddleware,isAdmin,updateBanco)
router.delete('/:id',authMiddleware,isAdmin,deleteBanco)
router.get('/:id',getBanco)
router.get('/',getAllBanco)

module.exports=router