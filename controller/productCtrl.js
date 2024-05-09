const Product = require("../models/productModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const slugify=require('slugify')
const validateMongoDbId= require("../utils/validateMongodbid")

const createProduct = asyncHandler(async (req,res)=>{
   
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newProduct = await  Product.create(req.body)
        res.json(newProduct)
    }catch(error)
    {
        throw new Error(error)
    }
   
   
})

const updateProduct = asyncHandler(async(req,res)=>{
    const id=req.params
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate(
          id ,req.body,{new:true})
        res.json(updateProduct)

    }catch(error){
        throw new Error(error)
    }

})


const deleteProduct = asyncHandler(async(req,res)=>{
    const id=req.params
    try{
        const deleteProduct = await Product.findOneAndDelete(id)
        res.json(deleteProduct)

    }catch(error){
        throw new Error(error)
    }

})

const getaProduct = asyncHandler(async (req,res)=>
{
    const {id}=req.params
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct)
    }
    catch(error){
        throw new Error(error)
    }
})

const getAllProduct = asyncHandler(async (req,res)=>
    {
        try {

            //filtering
            const queryObj= {...req.query}
            const excludeFields=["page","sort","limit","fields"]
            excludeFields.forEach((el)=>delete queryObj[el])
            console.log(queryObj)
            let queryStr=JSON.stringify(queryObj)
            queryStr =queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
            
            let query = Product.find(JSON.parse(queryStr))

            //Sorting

            if(req.query.sort){
                const sortBy = req.query.sort.split(",").join(" ")
                query = query.sort(sortBy)
                console.log()

            }else{
                query=query.sort('-createdAt')
            }

            //limiting the fields

            if(req.query.fields){
                const fields = req.query.fields.split(",").join(" ")
                query = query.select(fields)

            }else {
                query=query.select('-__v')
            }

            // pagination

            const page=req.query.page
            const limit = req.query.limit
            const skip = (page -1)*limit
            query=query.skip(skip).limit(limit)
            if(req.query.page){
                const productCount=await Product.countDocuments()
                if(skip>= productCount) throw new Error("This page does not exists")
            }
            console.log(page,limit,skip)

            const product = await query

            res.json(product)
        }
        catch(error){
            throw new Error(error)
        }
    })
    

const addToWishList =asyncHandler(async (req,res)=>{
    const {_id} =req.user
    const {prodId} =req.body
    try {
        const user = await User.findById(_id)
        const bandera=[...user.wishlists]
        const bandera2=prodId
        const estado=bandera.find((hola)=>hola.toString()===bandera2)!== undefined
        console.log(estado)        
        if(estado){
            let user = await User.findOneAndUpdate(_id,{
                $pull:{wishlists:prodId}
            },{new:true})
            res.json(user)
         }else{
             let user = await User.findOneAndUpdate(_id,{
                 $push:{wishlists:prodId}
             },{new:true})
             res.json(user)
         }
    }
    catch (error)
    {
        throw new Error(error)
    }
})

const rating =asyncHandler (async (req,res)=>{
    const {_id}=req.user
    const {star,prodId}=req.body
    try{
        
        const product= await Product.findById(prodId)
        let alreadyRated = product.ratings.find((userId)=>userId.postedby.toString()===_id.toString())!== undefined
        console.log("Hola",alreadyRated)
        if(alreadyRated){
            const updateRating = await Product.updateOne({
                ratings:{$elemMatch: {alreadyRated}}
            },{
                $set:{"ratings.$star":star},
            },{
                new:true
            })

        }else {
            const rateProduct = await Product.findByIdAndUpdate(prodId,{
                $push:{
                    ratings:{
                        star:star,
                        postedby:_id
                    },
                }
            },{new:true})
        }
        const getallratings=await Product.findById(prodId)
        let totalRatings = getallratings.ratings.length
        let ratingsum = getallratings.ratings.map((item)=>item.star ).reduce(
            (prev,curr)=>prev+curr,0)
        let actualRating= Math.round(ratingsum/totalRatings)
        let finalproduct= await Product.findByIdAndUpdate(prodId,{
            totalrating:actualRating
        },{new:true})
        res.json(finalproduct)
    } catch(error){
        throw new Error(error)
    }

})



module.exports={
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating
}