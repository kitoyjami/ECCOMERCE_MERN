const express = require('express');
const router = express.Router();
const {
    createProfileSubtype,
    getAllProfileSubtypes,
    getProfileSubtype,
    updateProfileSubtype,
    deleteProfileSubtype
} = require('../controller/profileSubtypeController');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Ruta para crear un nuevo ProfileSubtype
router.post('/', authMiddleware, createProfileSubtype);

// Ruta para obtener todos los ProfileSubtypes
router.get('/', authMiddleware, getAllProfileSubtypes);

// Ruta para obtener un ProfileSubtype por ID
router.get('/:id', authMiddleware, getProfileSubtype);

// Ruta para actualizar un ProfileSubtype por ID
router.put('/:id', authMiddleware, updateProfileSubtype);

// Ruta para eliminar un ProfileSubtype por ID
router.delete('/:id', authMiddleware, deleteProfileSubtype);

module.exports = router;
