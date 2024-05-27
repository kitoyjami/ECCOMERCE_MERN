const Worker = require("../models/workerModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const slugify=require('slugify')
const validateMongoDbId= require("../utils/validateMongodbid")
const {cloudinaryUploadImg,
    cloudinaryDeleteImg

 }= require("../utils/cloudinary")
const fs = require('fs')

const createWorker = asyncHandler(async (req,res)=>{
   
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newWorker = await  Worker.create(req.body)
        res.json(newWorker)
    }catch(error)
    {
        throw new Error(error)
    }
})

const updateWorker = asyncHandler(async(req,res)=>{
    const id=req.params
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const updateWorker = await Worker.findOneAndUpdate(
          id ,req.body,{new:true})
        res.json(updateWorker)

    }catch(error){
        throw new Error(error)
    }

})


const deleteWorker = asyncHandler(async(req,res)=>{
    const id=req.params
    try{
        const deleteWorker = await Worker.findOneAndDelete(id)
        res.json(deleteWorker)

    }catch(error){
        throw new Error(error)
    }

})

const getaWorker = asyncHandler(async (req,res)=>
{
    const {id}=req.params
    try {
        const findWorker = await Worker.findById(id)
        res.json(findWorker)
    }
    catch(error){
        throw new Error(error)
    }
})

/* const getAllWorker = asyncHandler(async (req,res)=>
    {
        try {

            //filtering
            const queryObj= {...req.query}
            const excludeFields=["page","sort","limit","fields"]
            excludeFields.forEach((el)=>delete queryObj[el])
            console.log(queryObj)
            let queryStr=JSON.stringify(queryObj)
            queryStr =queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
            
            let query = Worker.find(JSON.parse(queryStr))

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
                const workerCount=await Worker.countDocuments()
                if(skip>= workerCount) throw new Error("This page does not exists")
            }
            console.log(page,limit,skip)

            const worker = await query

            res.json(worker)
        }
        catch(error){
            throw new Error(error)
        }
    })
     */

    const getAllWorker = asyncHandler(async (req, res) => {
        try {
          // Construir el objeto de consulta
          const queryObj = { ...req.query };
          const excludeFields = ['page', 'sort', 'limit', 'fields'];
          excludeFields.forEach(el => delete queryObj[el]);
      
          // Convertir operadores gte, gt, lte, lt a formato MongoDB
          let queryStr = JSON.stringify(queryObj);
          queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      
          // Parsear el objeto de consulta
          let query = Worker.find(JSON.parse(queryStr));

      
          // Filtrar por estado (trabajando actualmente o no)
          if (req.query.state !== undefined) {
            query = query.find({ state: req.query.state });
          }
      
          // Logging para depuración
          console.log('Consulta MongoDB:', query.getFilter());
      
          // Sorting
          if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
          } else {
            query = query.sort('-createdAt');
          }
      
          // Limitar los campos
          if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
          } else {
            query = query.select('-__v');
          }
      
          // Paginación
          const page = req.query.page * 1 || 1;
          const limit = req.query.limit * 1 || 10;
          const skip = (page - 1) * limit;
          query = query.skip(skip).limit(limit);
      
          if (req.query.page) {
            const workerCount = await Worker.countDocuments();
            if (skip >= workerCount) throw new Error('This page does not exist');
          }
      
          // Ejecutar la consulta
          const workers = await query;
      
          res.json(workers);
        } catch (error) {
          console.error('Error en la consulta:', error);
          res.status(400).json({ error: error.message });
        }
      });
      

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
    const {star,prodId,comment}=req.body
    try{
        
        const worker= await Worker.findById(prodId)
        let alreadyRated = worker.ratings.find((userId)=>userId.postedby.toString()===_id.toString())!== undefined
        if(alreadyRated){
            const updateRating = await Worker.updateOne({
                 "ratings.postedby": _id
            },{
                $set:{"ratings.$.star":star,"ratings.$.comment":comment},
            },{
                new:true
            })
        }else {
            const rateWorker = await Worker.findByIdAndUpdate(prodId,{
                $push:{
                    ratings:{
                        star:star,
                        comment:comment,
                        postedby:_id
                    },
                }
            },{new:true})
        }
        const getallratings=await Worker.findById(prodId)
        let totalRatings = getallratings.ratings.length
        let ratingsum = getallratings.ratings.map((item)=>item.star ).reduce(
            (prev,curr)=>prev+curr,0)
        let actualRating= Math.round(ratingsum/totalRatings)
        let finalworker= await Worker.findByIdAndUpdate(prodId,{
            totalrating:actualRating
        },{new:true})
        res.json(finalworker)
    } catch(error){
        throw new Error(error)
    }

})


module.exports={
    createWorker,
    getaWorker,
    getAllWorker,
    updateWorker,
    deleteWorker,
    addToWishList,
    rating,
}