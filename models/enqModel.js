const mongoose = require('mongoose');

// Define the schema for the Enquiry model
const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Submitted", "Contacted", "In Progress"],
        default: "Submitted"
    }
});

// Export the model
module.exports = mongoose.model('Enquiry', enquirySchema);
