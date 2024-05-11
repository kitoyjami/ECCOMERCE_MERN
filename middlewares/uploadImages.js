const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg');
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({ message: 'Unsupported file format' });
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldNameSize: 2000000 }
});

const productImgResize = async (req, res, next) => {
    if (!req.files || !Array.isArray(req.files)) return next();

    await Promise.all(
        req.files.map(async (file) => {
            try {
                const img = await Jimp.read(file.path);
                await img.resize(300, 300).quality(90).writeAsync(`public/images/products/${file.filename}`);
                console.log("Imagen redimensionada y escrita correctamente");

                // Eliminar el archivo
                if (fs.existsSync(`public/images/products/${file.filename}`)) {
                    fs.unlinkSync(`public/images/products/${file.filename}`);
                    console.log("Imagen eliminada correctamente");
                } else {
                    console.warn(`El archivo no existe: public/images/products/${file.filename}`);
                }
            } catch (error) {
                console.error("Error al procesar la imagen:", error);
            }
        })
    );

    next();
};


const blogImgResize = async (req, res, next) => {
    if (!req.files || !Array.isArray(req.files)) return next();

    await Promise.all(
        req.files.map(async (file) => {
            try {
                const img = await Jimp.read(file.path);
                await img.resize(300, 300).quality(90).writeAsync(`public/images/blogs/${file.filename}`);
                console.log("Imagen redimensionada y escrita correctamente");

                // Eliminar el archivo
                if (fs.existsSync(`public/images/blogs/${file.filename}`)) {
                    fs.unlinkSync(`public/images/blogs/${file.filename}`);
                    console.log("Imagen eliminada correctamente");
                } else {
                    console.warn(`El archivo no existe: public/images/blogs/${file.filename}`);
                }
            } catch (error) {
                console.error("Error al procesar la imagen:", error);
            }
        })
    );

    next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
