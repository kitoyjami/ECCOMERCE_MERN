const Category=require("../models/wcategoryModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId= require ("../utils/validateMongodbid")

const createProdcategory= asyncHandler (async(req,res)=>{
    try{
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const updateCategory= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const updatedCategory = await Category.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updatedCategory)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const deleteCategory= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const deleteCategory = await Category.findByIdAndDelete(id)
        res.json(deleteCategory)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const getCategory= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const getCategory = await Category.findById(id)
        res.json(getCategory)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const getAllCategory= asyncHandler (async(req,res)=>{

    try{
        const getAllCategory = await Category.find()
        res.json(getAllCategory)
    }
    catch(error)
    {
        throw new Error(error)
    }
})



module.exports={
    createProdcategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
}