const express = require("express")
const { 
    createProdcategory, 
    updateCategory, 
    deleteCategory, 
    getCategory,
    getAllCategory} = require("../controller/categoryCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,isAdmin,createProdcategory)
router.put('/:id',authMiddleware,isAdmin,updateCategory)
router.delete('/:id',authMiddleware,isAdmin,deleteCategory)
router.get('/:id',getCategory)
router.get('/',getAllCategory)

module.exports=router