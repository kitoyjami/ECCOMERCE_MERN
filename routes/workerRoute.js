const express =require("express")
const { 
    createWorker,
    getaWorker,
    getAllWorker, 
    updateWorker, 
    deleteWorker, 
    addToWishList, 
    rating, 
  } = require("../controller/workerCtrl")
const router = express.Router()
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware')

router.post('/',authMiddleware,isAdmin,createWorker)

router.get('/:id',getaWorker)
router.put('/wishlist',authMiddleware,isAdmin,addToWishList)
router.put('/rating',authMiddleware,rating)

router.get('/',getAllWorker)
router.put('/:_id',authMiddleware,isAdmin,updateWorker)
router.delete('/:_id',authMiddleware,isAdmin,deleteWorker)

module.exports =router  