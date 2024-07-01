const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
const ProfileMasterTable = require("../models/ProfileMasterTable");

const createProfileMasterTable = asyncHandler(async (req, res) => {
    try {
        const newProfileMasterTable = await ProfileMasterTable.create(req.body);
        res.json(newProfileMasterTable);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProfileMasterTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedProfileMasterTable = await ProfileMasterTable.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProfileMasterTable);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProfileMasterTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedProfileMasterTable = await ProfileMasterTable.findByIdAndDelete(id);
        res.json(deletedProfileMasterTable);
    } catch (error) {
        throw new Error(error);
    }
});

const getProfileMasterTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const profileMasterTable = await ProfileMasterTable.findById(id).populate('SubTypeName');
        res.json(profileMasterTable);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProfileMasterTables = asyncHandler(async (req, res) => {
    try {
        const allProfileMasterTables = await ProfileMasterTable.find().populate('SubTypeName');
        res.json(allProfileMasterTables);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProfileMasterTable,
    updateProfileMasterTable,
    deleteProfileMasterTable,
    getProfileMasterTable,
    getAllProfileMasterTables,
};
