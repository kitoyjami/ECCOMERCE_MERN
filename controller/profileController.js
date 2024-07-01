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
    const { page = 1, limit = 100, fields, subtypename, ...filters } = req.query;

    let query = {};

    // Aplicar filtros
    for (const key in filters) {
        if (filters[key]) {
            query[key] = filters[key];
        }
    }

    // Filtrar por SubTypeName
    if (subtypename) {
        const subType = await ProfileSubtype.findOne({ SubtypeName: subtypename }).select('_id');
        if (subType) {
            query.SubTypeName = subType._id;
        } else {
            // Si no se encuentra el subtipo, devolver vacío
            return res.status(200).json({
                profiles: [],
                totalPages: 0,
                currentPage: page
            });
        }
    }

    // Seleccionar campos específicos
    let selectedFields = '';
    if (fields) {
        selectedFields = fields.split(',').join(' ');
    }

    // Construir la consulta
    const profilesQuery = Profile.find(query)
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
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const profiles = await profilesQuery.exec();

    // Obtener el conteo total de documentos
    const count = await Profile.countDocuments(query);

    res.status(200).json({
        profiles,
        totalPages: Math.ceil(count / limit),
        currentPage: page
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
