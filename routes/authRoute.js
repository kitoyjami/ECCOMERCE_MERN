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
    resetPassword} 
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
router.get("/logout",logout)
router.get("/:id",authMiddleware,isAdmin,getaUser)
router.delete("/:id",deleteaUser)
router.put("/edit",authMiddleware,updateaUser)

router.put("/password",authMiddleware,updatePassword)

router.put("/block-user/:id",authMiddleware,isAdmin,blockUser)
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser)
    


module.exports=router