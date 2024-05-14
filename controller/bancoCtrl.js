const Banco=require("../models/bancoModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId= require ("../utils/validateMongodbid")

const createBanco= asyncHandler (async(req,res)=>{
    try{
        const newBanco = await Banco.create(req.body)
        res.json(newBanco)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const updateBanco= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const updatedBanco = await Banco.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updatedBanco)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const deleteBanco= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const deleteBanco = await Banco.findByIdAndDelete(id)
        res.json(deleteBanco)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const getBanco= asyncHandler (async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const getBanco = await Banco.findById(id)
        res.json(getBanco)
    }
    catch(error)
    {
        throw new Error(error)
    }
})

const getAllBanco= asyncHandler (async(req,res)=>{

    try{
        const getAllBanco = await Banco.find()
        res.json(getAllBanco)
    }
    catch(error)
    {
        throw new Error(error)
    }
})



module.exports={
    createBanco,
    updateBanco,
    deleteBanco,
    getBanco,
    getAllBanco
}