// models/ProfileMasterTable.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileMasterTableSchema = new Schema({
    TypeName: { type: String, required: false },
    TypeNameText: { type: String, required: false },
    TableName: { type: String, required: false },
    TableColumns: { type: Number, required: false },
    RunName: { type: String, required: false },
    SubTypeName: { type: Schema.Types.ObjectId, ref: 'ProfileSubtype', required: false },
    OrderBy: { type: String, required: false },
    OwnerText: { type: String, required: false },
    SpecificGravity: { type: Number, required: false },
    Material: { type: String, default: null },
    TypeClass: { type: String, default: null },
    English: { type: String, required: false },
    Spanish: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('ProfileMasterTable', profileMasterTableSchema);
