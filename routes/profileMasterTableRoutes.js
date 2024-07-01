const express = require('express');
const router = express.Router();
const {
    createProfileMasterTable,
    getAllProfileMasterTables,
    getProfileMasterTable,
    updateProfileMasterTable,
    deleteProfileMasterTable
} = require('../controller/profileMasterTableController');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Ruta para crear un nuevo ProfileMasterTable
router.post('/', authMiddleware, createProfileMasterTable);

// Ruta para obtener todos los ProfileMasterTables
router.get('/', authMiddleware, getAllProfileMasterTables);

// Ruta para obtener un ProfileMasterTable por ID
router.get('/:id', authMiddleware, getProfileMasterTable);

// Ruta para actualizar un ProfileMasterTable por ID
router.put('/:id', authMiddleware, updateProfileMasterTable);

// Ruta para eliminar un ProfileMasterTable por ID
router.delete('/:id', authMiddleware, deleteProfileMasterTable);

module.exports = router;
