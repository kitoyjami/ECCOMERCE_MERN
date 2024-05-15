const mongoose = require('mongoose'); // Erase if already required
const bcrypt =require('bcrypt')
const crypto =require('crypto')

// Declare the Schema of the Mongo model
var workerSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        index:true,
    },
    lasttname:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    photoP:[
        {
            public_id:String,
            url:String
        }
    ],
    photoDni:[
        {
            public_id:String,
            url:String
        }
    ],
    position:{
        type:String,
        required:true,
    },
    state:{
        type:Boolean,
        default:false
    },
    sueldo:{
        type: Number,
    },
    cuentasB:
        [
           { 
              banco: String,
              nro: String,
              cci: String
           }
        ],
    addres: {
        type: String,
    },
    ratings:[
        {
            star:Number,
            comment: String,
            postedby:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
        } 
    ],

},{
    timestamps:true,
});




//Export the model
module.exports = mongoose.model('Worker', workerSchema);