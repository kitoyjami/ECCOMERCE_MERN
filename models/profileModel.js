// models/profileModel.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    // Propiedades comunes
    TypeName: { type: String, required: false },
    TypeNameText: { type: String, required: false },
    TableName: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileMasterTable', required: true },
    TableColumns: { type: Number, required: false },
    RunName: { type: String, required: false },
    SubTypeName: { type: String, required: false },
    OrderBy: { type: String, required: false },
    OwnerText: { type: String, required: false },
    SpecificGravity: { type: Number, required: false },
    Material: { type: String, required: false },
    TypeClass: { type: String, required: false },
    English: { type: String, required: false },
    Spanish: { type: String, required: false },
    StandardName: { type: String, required: false },
    SectionName: { type: String, required: false },
    G: { type: Number, required: false }, // weight per meter, puede ser null

    // Propiedades adicionales
    AdditionalProperties: { type: Map, of: mongoose.Schema.Types.Mixed }
}, { strict: false });

module.exports = mongoose.model('Profile', profileSchema);
