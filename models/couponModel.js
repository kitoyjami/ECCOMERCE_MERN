const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true,
        uppercase:true
    },
    expiry:{
        type: Date,
        require:true
    },
    discount:{
        type:Number,
        required:true
    }
}
);

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);