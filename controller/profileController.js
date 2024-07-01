// controller/profileController.js
const Profile = require('../models/profileModel');
const ProfileMasterTable = require('../models/ProfileMasterTable');
const ProfileSubtype= require('../models/ProfileSubtype');
const asyncHandler = require('express-async-handler');

// Crear un nuevo perfil
const createProfile = asyncHandler(async (req, res) => {
    const { TableName } = req.body;

    // Buscar el ProfileMasterTable por TableName
    const masterTable = await ProfileMasterTable.findOne({ TableName });

    if (masterTable) {
        req.body.TableName = masterTable._id;

        const profile = new Profile(req.body);
        await profile.save();
        res.status(201).json(profile);
    } else {
        res.status(404).json({ message: 'ProfileMasterTable not found' });
    }
});


// Obtener todos los perfiles (con filtros y paginación)
const getAllProfiles = asyncHandler(async (req, res) => {
    const { subtypename, tablename, fields, limit = 100, page = 1 } = req.query;

    // Construir el filtro de consulta
    const query = {};
    if (subtypename) {
        const subtype = await ProfileSubtype.findOne({ SubtypeName: subtypename });
        if (subtype) {
            query.SubTypeName = subtype._id;
        } else {
            return res.status(404).json({ message: "SubtypeName not found" });
        }
    }

    if (tablename) {
        const table = await ProfileMasterTable.findOne({ TableName: tablename });
        if (table) {
            query.TableName = table._id;
        } else {
            return res.status(404).json({ message: "TableName not found" });
        }
    }

    // Construir la selección de campos
    const selectedFields = fields ? fields.split(',').join(' ') : '';

    // Obtener los perfiles con paginación, filtros y selección de campos
    const profiles = await Profile.find(query)
        .select(selectedFields)
        .populate({
            path: 'TableName',
            select: 'TypeNameText Material SubTypeName',
            populate: {
                path: 'SubTypeName',
                model: 'ProfileSubtype',
                select: 'SubtypeName'
            }
        })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .exec();

    // Obtener el total de documentos para la paginación
    const totalDocuments = await Profile.countDocuments(query);

    res.json({
        profiles,
        totalPages: Math.ceil(totalDocuments / limit),
        currentPage: Number(page)
    });
});

// Obtener un perfil por ID
const getProfileById = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.id)
        .populate('TableName', 'TypeNameText Material')
        .populate('SubTypeName', 'SubTypeName');
    if (profile) {
        res.status(200).json(profile);
    } else {
        res.status(404).json({ message: 'Profile not found' });
    }
});

// Actualizar un perfil por ID
const updateProfile = asyncHandler(async (req, res) => {
    const { TableName } = req.body;
    const profile = await Profile.findById(req.params.id);

    if (profile) {
        if (TableName) {
            const masterTable = await ProfileMasterTable.findOne({ TableName });
            if (masterTable) {
                req.body.TableName = masterTable._id;
            } else {
                return res.status(404).json({ message: 'ProfileMasterTable not found' });
            }
        }

        Object.assign(profile, req.body);
        await profile.save();
        res.status(200).json(profile);
    } else {
        res.status(404).json({ message: 'Profile not found' });
    }
});

// Eliminar un perfil por ID
const deleteProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (profile) {
        res.status(200).json({ message: 'Profile removed' });
    } else {
        res.status(404).json({ message: 'Profile not found' });
    }
});

module.exports = {
    createProfile,
    getAllProfiles,
    getProfileById,
    updateProfile,
    deleteProfile
};
