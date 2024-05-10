const express = require('express')
const { isAdmin,authMiddleware } = require('../middlewares/authMiddleware')
const { 
    createBlog,
    updateBlog, 
    getBlog, 
    getAllBlog, 
    deleteBlog, 
    likeBlog,
    dislikeBlog,
    uploadImages} = require('../controller/blogCtrl')
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages')
const router = express.Router()

router.post('/',authMiddleware,isAdmin,createBlog)

router.put('/upload/:id',
authMiddleware,
uploadPhoto.array('images',10),
blogImgResize,
uploadImages,
)

router.put('/like',authMiddleware,likeBlog)
router.put('/dislike',authMiddleware,dislikeBlog)
router.put('/:id',authMiddleware,isAdmin,updateBlog)
router.delete('/:id',authMiddleware,isAdmin,deleteBlog)
router.get('/:id',getBlog)
router.get('/',getAllBlog)

module.exports = router 