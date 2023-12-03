const express = require('express')
const { createUser, loginUserCtlr, getAllUser, getaUser, deleteaUser, updateaUser } = require('../controller/userCtrl')
const router = express.Router()

createUser


router.post("/register",createUser)
router.post("/login",loginUserCtlr)
router.get("/users",getAllUser)
router.get("/:id",getaUser)
router.delete("/:id",deleteaUser)
router.put("/:id",updateaUser)
module.exports=router