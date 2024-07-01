// models/ProfileMasterTable.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileMasterTableSchema = new Schema({
    TypeName: { type: String, required: true },
    TypeNameText: { type: String, required: true },
    TableName: { type: String, required: true },
    TableColumns: { type: Number, required: true },
    RunName: { type: String, required: true },
    SubTypeName: { type: Schema.Types.ObjectId, ref: 'ProfileSubtype', required: true },
    OrderBy: { type: String, required: true },
    OwnerText: { type: String, required: true },
    SpecificGravity: { type: Number, required: true },
    Material: { type: String, default: null },
    TypeClass: { type: String, default: null },
    English: { type: String, required: true },
    Spanish: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ProfileMasterTable', profileMasterTableSchema);
