const express = require('express')
const { createUser, loginUserCtlr, getAllUser, getaUser, deleteaUser, updateaUser } = require('../controller/userCtrl')
const router = express.Router()

createUser

const {authMiddleware, isAdmin}=require("../middlewares/authMiddleware")

router.post("/register",createUser)
router.post("/login",loginUserCtlr)
router.get("/users",getAllUser)
router.get("/:id",authMiddleware,isAdmin,getaUser)
router.delete("/:id",deleteaUser)
router.put("/edit",authMiddleware,updateaUser)

module.exports=router