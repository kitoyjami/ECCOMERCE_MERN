const express = require('express')
const { createUser, loginUserCtlr, getAllUser, getaUser, deleteaUser, updateaUser, blockUser, unblockUser, handleRefreshTOken } = require('../controller/userCtrl')
const router = express.Router()

createUser

const {authMiddleware, isAdmin}=require("../middlewares/authMiddleware")

router.post("/register",createUser)
router.post("/login",loginUserCtlr)
router.get("/users",getAllUser)
router.get("/refresh",handleRefreshTOken)
router.get("/:id",authMiddleware,isAdmin,getaUser)
router.delete("/:id",deleteaUser)
router.put("/edit",authMiddleware,updateaUser)

router.put("/block-user/:id",authMiddleware,isAdmin,blockUser)
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser)


module.exports=router