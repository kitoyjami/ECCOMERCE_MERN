const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")


const createProduct = asyncHandler(async (req,res)=>{
    res.json({
        msg: "Hey it's product post route"
    })
})




module.exports={createProduct}