const express = require('express')
const { createUser, loginUserCtlr, 
    getAllUser,
    getaUser, 
    deleteaUser, 
    updateaUser, 
    blockUser, 
    unblockUser,
    handleRefreshTOken, 
    logout, 
    updatePassword,
    forgotPasswordToken, 
    resetPassword,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrder,
    updateOrderStatus,
    getAllOrder} 
    = require('../controller/userCtrl')
const router = express.Router()
createUser

const {authMiddleware, isAdmin}=require("../middlewares/authMiddleware")

router.post("/register",createUser)
router.post("/login",loginUserCtlr)
router.post('/forgot-password-token',forgotPasswordToken)

router.put('/reset-password/:token',resetPassword)

router.get("/users",getAllUser)
router.get("/refresh",handleRefreshTOken)
router.get("/cart",authMiddleware,getUserCart)
router.post('/cart',authMiddleware,userCart)
router.delete('/cart',authMiddleware,emptyCart)
router.put('/cart/applycoupon',authMiddleware,applyCoupon)
router.put('/order/update-order/:id',authMiddleware,updateOrderStatus)

router.post('/cart/cash-order',authMiddleware,createOrder)
router.get("/get-orders",authMiddleware,getOrder)
router.get("/get-all-orders",authMiddleware,isAdmin,getAllOrder)


router.get("/:id",authMiddleware,isAdmin,getaUser)
router.get("/wishlist/:id",authMiddleware,getWishList)


router.delete("/:id",deleteaUser)
router.put("/edit",authMiddleware,updateaUser)

router.put("/save-address",authMiddleware,saveAddress)
router.put("/password",authMiddleware,updatePassword)

router.put("/block-user/:id",authMiddleware,isAdmin,blockUser)
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser)
router.post("/logout",authMiddleware,logout)    


module.exports=router