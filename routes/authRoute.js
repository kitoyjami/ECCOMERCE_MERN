const express = require('express')
const { createUser, loginUserCtlr, getAllUser, getaUser, deleteaUser, updateaUser } = require('../controller/userCtrl')
const router = express.Router()

createUser

const {authMiddleware}=require("../middlewares/authMiddleware")

router.post("/register",createUser)
router.post("/login",loginUserCtlr)
router.get("/users",getAllUser)
router.get("/:id",authMiddleware,getaUser)
router.delete("/:id",deleteaUser)
router.put("/:id",updateaUser)

module.exports=router