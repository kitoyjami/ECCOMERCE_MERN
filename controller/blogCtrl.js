const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require ('express-async-handler')
const validateMongoDbId= require ("../utils/validateMongodbid")
const { json } = require('body-parser')

const createBlog=asyncHandler(async (req,res)=>{
    try{
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    }
    catch(error){
        throw new Error(error)
    }
})

const updateBlog=asyncHandler(async (req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateBlog)
    }
    catch(error){
        throw new Error(error)
    }
})

const getBlog=asyncHandler(async (req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes')
        const updateViews = await Blog.findByIdAndUpdate(id,{
            $inc:{numViews:1},
        },{new:true})
        res.json(getBlog)
    }
    catch(error){
        throw new Error(error)
    }
})

const getAllBlog= asyncHandler(async (req,res)=>{
    try{
        const getBlogs = await Blog.find()
        res.json(getBlogs)
    }
    catch(error){
        throw new Error(error)
    }
})


const deleteBlog=asyncHandler(async (req,res)=>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id)
        console.log(id)
        res.json(deleteBlog)
    }
    catch(error){
        throw new Error(error)
    }
})

const likeBlog =asyncHandler(async (req,res)=>{
    const {blogId}=req.body
    validateMongoDbId(blogId)
    // Find the blog which you want to be liked
    const blog =await Blog.findById(blogId)

    //Find the login user
    const loginUserId = req?.user?._id

    // find if the user has liked the blog
    const isLiked1= blog?.isLiked
    // find if the user has disliked the blog
    const alreadyDisliked=blog?.dislikes?.find(
        (userId)=> {
            userId?.toString() === loginUserId?.toString()
        }
    )
    console.log("hola 1 ",alreadyDisliked)

    if(alreadyDisliked){
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false
        },{new:true})
        console.log(alreadyDisliked)
        res.json(blog)
    }
    if(isLiked1){
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false
        },{new:true})
        res.json(blog)
        console.log(isLiked1)
    }
    else{
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $push:{likes:loginUserId},
            isLiked:true
        },{new:true})
        res.json(blog)
    }
})

const dislikeBlog =asyncHandler(async (req,res)=>{
    const {blogId}=req.body
    validateMongoDbId(blogId)
    // Find the blog which you want to be liked
    const blog =await Blog.findById(blogId)

    //Find the login user
    const loginUserId = req?.user?._id

    // find if the user has liked the blog
    const isDisLiked1= blog?.isDisliked
    // find if the user has disliked the blog
    const alreadyLiked=blog?.likes?.find(
        (userId)=> {
            userId?.toString() === loginUserId?.toString()
        }
    )
    console.log("hola 1 ",alreadyLiked)

    if(alreadyLiked){
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false
        },{new:true})
        console.log(alreadyLiked)
        res.json(blog)
    }
    if(isDisLiked1){
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false
        },{new:true})
        res.json(blog)
        console.log(isLiked1)
    }
    else{
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $push:{dislikes:loginUserId},
            isDisliked:true
        },{new:true})
        res.json(blog)
    }
})

module.exports={
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog
}


