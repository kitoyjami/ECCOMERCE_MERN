const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");
const ProfileSubtype = require("../models/ProfileSubtype");

const createProfileSubtype = asyncHandler(async (req, res) => {
    try {
        const newProfileSubtype = await ProfileSubtype.create(req.body);
        res.json(newProfileSubtype);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProfileSubtype = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedProfileSubtype = await ProfileSubtype.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProfileSubtype);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProfileSubtype = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedProfileSubtype = await ProfileSubtype.findByIdAndDelete(id);
        res.json(deletedProfileSubtype);
    } catch (error) {
        throw new Error(error);
    }
});

const getProfileSubtype = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const profileSubtype = await ProfileSubtype.findById(id);
        res.json(profileSubtype);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProfileSubtypes = asyncHandler(async (req, res) => {
    try {
        const allProfileSubtypes = await ProfileSubtype.find();
        res.json(allProfileSubtypes);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProfileSubtype,
    updateProfileSubtype,
    deleteProfileSubtype,
    getProfileSubtype,
    getAllProfileSubtypes,
};
