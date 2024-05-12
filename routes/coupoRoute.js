const express=require("express")
const { 
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    getAllCoupon
} = require("../controller/couponCtrl")
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware")
const router=express.Router()


router.post("/",authMiddleware,isAdmin,createCoupon)
router.put('/:id',authMiddleware,isAdmin,updateCoupon)
router.delete('/:id',authMiddleware,isAdmin,deleteCoupon)
router.get('/:id',getCoupon)
router.get('/',getAllCoupon)


module.exports=router