const express = require("express")
const { 
    createAttendance, 
    updateAttendance, 
    deleteAttendance, 
    getAttendanceById,
    getAttendances} = require("../controller/attendanceCtrl")
const { authMiddleware} = require("../middlewares/authMiddleware")
const router = express.Router()


router.post('/',authMiddleware,createAttendance)
router.put('/:id',authMiddleware,updateAttendance)
router.delete('/:id',authMiddleware,deleteAttendance)
router.get('/:id',getAttendanceById)
router.get('/',getAttendances)

module.exports=router
