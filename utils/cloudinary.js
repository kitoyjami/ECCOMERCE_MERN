const cloudinary = require('cloudinary').v2


cloudinary.config({ 
  cloud_name: process.env.CL_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const cloudinaryUploadImg= async (flieToUpload)=>{
    return new Promise((resolve,reject)=>{
cloudinary.uploader.upload(flieToUpload, (error,result)=>{
    if (error) {
        reject(error);
    } else {
        resolve(
            {
                url:result.secure_url,
                asset_id:result.asset_id,
                public_id:result.public_id
            }
        );
    }
})
    })

}

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(fileToDelete, (error, result) => {
            if (error) {
                reject(error);
            } else {
                const { secure_url, asset_id, public_id } = result;
                resolve({ url: secure_url, asset_id, public_id });
            }
        });
    });
};



module.exports={
    cloudinaryUploadImg,
    cloudinaryDeleteImg
}