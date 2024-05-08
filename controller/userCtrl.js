const { generateToken } = require("../config/jwtToken")
const User=require("../models/userModel")
const asyncHandler=require('express-async-handler')
const validateMongoDbId =require("../utils/validateMongodbid")
const {generateRefreshToken} =require("../config/refreshtoken")
const jwt=require("jsonwebtoken")
const crypto = require("crypto")
const sendEmail = require("./emailCrl")

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
        const refreshToken=await generateRefreshToken(findUser?._id)
        const updateuser=await User.findByIdAndUpdate(
            findUser.id,
            {
            refreshToken:refreshToken
            },
            {new:true}
        )
        
        res.cookie('refreshToken', refreshToken,{
            httpOnly:true,
            maxAge: 72*60*60*1000,
        }) 

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

//handle refresh token

const handleRefreshTOken =asyncHandler (async (req,res) =>{
    const cookie=req.cookies
    console.log(cookie)
    if(!cookie?.refreshToken) throw new Error ("No Refresh token in cookies")
    const refreshToken =cookie.refreshToken
    console.log(refreshToken)
    const user= await User.findOne({refreshToken})
    if(!user) throw new Error('No refresh token present in db')
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id !==decoded.id){
            throw new Error('There is something wrong with refresh token')
        }
        const accessToken= generateToken(user?._id)
        res.json({accessToken})
    })

    
})

// logout functionality

const logout = asyncHandler (async (req,res)=>{
    const cookie =req.cookies
    if(!cookie?.refreshToken) throw new Error ("No Refresh token in cookies")
    const refreshToken =cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly:true,
            secure:true, 
        })
        return res.sendStatus(204) //forbidden
    }
    await User.findOneAndUpdate({refreshToken},{
        refreshToken:""
    })
    res.clearCookie('refreshToken', {
        httpOnly:true,
        secure:true, 
    })
    return res.sendStatus(204) //forbidden
    

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
    validateMongoDbId(id)
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
    validateMongoDbId(id)
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
    validateMongoDbId(_id)
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
    validateMongoDbId(id)
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
    validateMongoDbId(id)
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

const updatePassword = asyncHandler(async(req,res)=>{
    const{_id}=req.user
    const {password}=req.body
    console.log(_id)
    validateMongoDbId(_id)
    const user =  await User.findById(_id)
    console.log(user)
    if(password){
        user.password=password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    }
    else {
        res.json(user)
    }
})

const forgotPasswordToken = asyncHandler(async (req,res)=>{
    const {email}=req.body
    const user = await User.findOne({email})
    if(!user) throw new Error("User not found with this email")
    try{
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `Hi, Please follor his link to reset Your Password.
        This linkd is valid till 10 minutes from now. 
        <a href='http://localhost:4000/api/user/reset-password/${token}'> Click Here</a>`
        const data={
            to: email,
            text:"Hey User",
            subject:"Forgot Password",
            htm:resetURL

            }
            sendEmail(data)
            res.json(token)
        }
        catch(error){
            throw new Error(error)
        }
    }
)

const resetPassword =asyncHandler (async (req,res)=>{
    const {password} =req.body
    const {token} =req.params
    const hashedToken=crypto.createHash('sha256').update(token).digest("hex")
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt : Date.now()}
    })
    if(!user) throw new Error("Token Expired, Please try again later")
    user.password=password
    user.passwordResetToken=undefined
    user.passwordResetExpires=undefined
    await user.save()
    res.json(user)
})

module.exports = {
    createUser,
    loginUserCtlr,
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
    resetPassword
}