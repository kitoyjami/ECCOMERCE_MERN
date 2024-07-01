const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for ProfileSubtypes
const profileSubtypeSchema = new Schema({
    SubtypeName: {
        type: String,
        required: true,
        unique: true
    },
    Description: {
        type: String,
        required: true
    },
    English: {
        type: String,
        required: true
    },
    Spanish: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the model from the schema
const ProfileSubtype = mongoose.model('ProfileSubtype', profileSubtypeSchema);

module.exports = ProfileSubtype;
