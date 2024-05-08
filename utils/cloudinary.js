const cloudinary = require('cloudinary')



import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({ 
  cloud_name: process.env.CL_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const cloudinaryUploadImg= async (flieToUpload)=>{
    return new Promise((resolve)=>{
cloudinary.UploadStream.upload(flieToUpload, (result)=>{
    resolve({
        url:result.secure_url
    },{
        resource_type:"auto"
    })
})
    })

}

module.exports=cloudinaryUploadImg