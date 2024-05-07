const mongoose =require ('mongoose')

var productSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
        trim:true
    },
    slug:{
        type:String,
        require:true,
        unique: true,
        lowercase:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type: Number,
        require:true
    },
    category:{
        type:String,
        required:true,
    },

    brand:{
        type:String,
        required:true,
    },
    
    quantity: {
        type:Number,
        require: true,
        selection:false,
    },
    sold:{
        type:Number,
        default:0,
    },
    images:{
        type: Array,

    },
    color:{
        type:String,
        required:true,
    },
    ratings:[{star:Number,
        postedby:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
    }
         
    ]

},{timestamps:true})

module.exports= mongoose.model('Product',productSchema)