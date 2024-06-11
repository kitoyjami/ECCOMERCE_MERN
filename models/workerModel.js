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
    dni:{
        type:String,
        unique:true,
        default:"No agregado",
    },
    photoP:[
        {
            public_id: {
                type: String,
                default: 'falta' // Establece aquí el valor predeterminado para 'public_id'
              },
              url: {
                type: String,
                default: 'https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png' // Establece aquí el valor predeterminado para 'url'
              }
        }
    ],
    photoDni:[
        {
            public_id: {
                type: String,
                default: ''
            },
            url: {
                type: String,
                default: ''
            }
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