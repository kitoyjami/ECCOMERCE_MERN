const express =require("express")
const { 
    createProduct,
    getaProduct,
    getAllProduct, 
    updateProduct, 
    deleteProduct, 
    addToWishList, 
    rating } = require("../controller/productCtrl")
const router = express.Router()
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware')

router.post('/',authMiddleware,isAdmin,createProduct)
router.get('/:id',getaProduct)
router.put('/wishlist',authMiddleware,isAdmin,addToWishList)
router.put('/rating',authMiddleware,rating)

router.get('/',getAllProduct)
router.put('/:_id',authMiddleware,isAdmin,updateProduct)
router.delete('/:_id',authMiddleware,isAdmin,deleteProduct)
module.exports =router  