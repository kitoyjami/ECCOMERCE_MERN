const Product = require("../models/productModel")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const slugify=require('slugify')
const validateMongoDbId= require("../utils/validateMongodbid")
const {cloudinaryUploadImg,
    cloudinaryDeleteImg

 }= require("../utils/cloudinary")
const fs = require('fs')

const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = (path) => cloudinaryUploadImg(path,"images")
        const urls=[]
        const files = req.files
        for(const file of files){
            const {path}= file
            const newPath=await uploader(path)
            console.log(newPath)
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        const images=urls.map((file)=>{
            return file
        })
        res.json(images)

    } catch (error) 
    
    {
        console.error("Error en la carga de imágenes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        // Llamar a la función para eliminar la imagen en Cloudinary
        const deletedImage = await cloudinaryDeleteImg(id);

        // Si la eliminación es exitosa, responder con un mensaje de éxito
        res.json({
            message: "Image deleted successfully",
            deletedImage: deletedImage
        });
    } catch (error) {
        // Manejar errores, incluido el caso en que la imagen no exista
        console.error("Error al eliminar la imagen:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports={
    uploadImages,
    deleteImages
}
