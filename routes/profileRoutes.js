// routes/profileRoutes.js
const express = require('express');
const {
    createProfile,
    getAllProfiles,
    getProfileById,
    updateProfile,
    deleteProfile
} = require('../controller/profileController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(authMiddleware, isAdmin, createProfile)
    .get(authMiddleware, getAllProfiles);

router.route('/:id')
    .get(authMiddleware, getProfileById)
    .put(authMiddleware, isAdmin, updateProfile)
    .delete(authMiddleware, isAdmin, deleteProfile);

module.exports = router;
