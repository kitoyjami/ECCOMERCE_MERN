const Color=require("../models/colorModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId= require ("../utils/validateMongodbid")

const createColor= asyncHandler (async(req,res)=>{
    try{
        const newColor = await Color.create(req.body)
        res.json(newColor)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const updateColor= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const updatedColor = await Color.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updatedColor)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const deleteColor= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const deleteColor = await Color.findByIdAndDelete(id)
        res.json(deleteColor)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const getColor= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const getColor = await Color.findById(id)
        res.json(getColor)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const getAllColor= asyncHandler (async(req,res)=>{

    try{
        const getAllColor = await Color.find()
        res.json(getAllColor)
    }
    catch(error)
    {
        throw new Error(error)
    }
})



module.exports={
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getAllColor
}