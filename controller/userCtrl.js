const { generateToken } = require("../config/jwtToken")
const User=require("../models/userModel")
const asyncHandler=require('express-async-handler')
const validateMongoDbId =require("../utils/validateMongodbid")

const createUser =asyncHandler(async (req,res) => {

    const email = req.body.email
    const findUser = await User.findOne({email:email})
    if (!findUser)
    {
        const newUser = await User.create(req.body)
        res.json(newUser)   
    }else {
        throw new Error ('User Already Exist')
    }




})

const loginUserCtlr=asyncHandler(async (req,res)=> {
    const {email,password} =req.body
    // check if user exist or not 
    const findUser=await User.findOne({email})
    if(findUser && await findUser.isPasswordMatched(password))
    {
        res.json({
            _id : findUser?.id,
            firstname: findUser?.firstname,
            lasttname: findUser?.lasttname,
            email : findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)

        })
    }else {
        throw new Error("Invalid Crendential")
    }
})

// GET ALL USERS

const getAllUser= asyncHandler(async (req,res)=>{
    console.log(req.params)
    try {
        const getUsers=await User.find()
        res.json(getUsers)
    }catch(error){
        throw new Error(error)
    }
})

const getaUser= asyncHandler(async (req,res)=>{
    const {id} =req.params
    try {
        
        const getaUser=await User.findById(id)
        res.json({
            getaUser
        })
    }catch(error){
        throw new Error(error)
    }
})

const deleteaUser= asyncHandler(async (req,res)=>{
    const {id} =req.params
    try {
        
        const deleteaUser=await User.findByIdAndDelete(id)
        res.json({
            deleteaUser
        })
    }catch(error){
        throw new Error(error)
    }
})

const updateaUser= asyncHandler(async (req,res)=>{
    
    const {_id} =req.user
    try {
        
        const updateaUser=await User.findByIdAndUpdate(_id,{
            firstname: req?.body?.firstname,
            lasttname: req?.body?.lasttname,
            email:  req?.body?.email,
            mobile: req?.body?.mobile
        },
        {
            new:true,

        })
        res.json({
            updateaUser
        })
    }catch(error){
        throw new Error(error)
    }
})

const blockUser = asyncHandler (async (req,res) =>{
    const {id}=req.params
    try{
        const block= await User.findByIdAndUpdate(id,{isBLocked: true
        }, {new : true})
        res.json(
            {
                msg: "User blocked"
            }
        )
    }catch(error){
        throw new Error(error)
    }


})

const unblockUser = asyncHandler (async (req,res) =>{
    const {id}=req.params
    try{
        const block=await User.findByIdAndUpdate(id,{isBLocked: false
        }, {new : true})
    }catch(error){
        throw new Error(error)
    }
    res.json(
        {
            msg: "User Unblocked"
        }
    )
})


module.exports = {createUser,loginUserCtlr,
    getAllUser,getaUser,deleteaUser,updateaUser,
blockUser,unblockUser}