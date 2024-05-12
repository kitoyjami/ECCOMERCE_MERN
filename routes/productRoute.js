const express =require("express")
const { 
    createProduct,
    getaProduct,
    getAllProduct, 
    updateProduct, 
    deleteProduct, 
    addToWishList, 
    rating, 
    uploadImages,
    deleteImages} = require("../controller/productCtrl")
const router = express.Router()
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages")

router.post('/',authMiddleware,isAdmin,createProduct)
router.put('/upload/',
authMiddleware,
uploadPhoto.array('images',10),
productImgResize,
uploadImages,
)

router.get('/:id',getaProduct)
router.put('/wishlist',authMiddleware,isAdmin,addToWishList)
router.put('/rating',authMiddleware,rating)

router.get('/',getAllProduct)
router.put('/:_id',authMiddleware,isAdmin,updateProduct)
router.delete('/:_id',authMiddleware,isAdmin,deleteProduct)
router.delete('/delete-img/:id',authMiddleware,isAdmin,deleteImages)
module.exports =router  