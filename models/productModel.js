const mongoose =require ("mongoose")

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
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },

    brand:{
        type:String,
        enum:['Apple','Samsung','Lenovo']
    },

    quantity: Number,
    sold:{
        type:Number,
        default:0,

    },
    images:{
        type: Array,

    },
    color:{
        type:String,
        enum:['Black','Brown','Red']
    },
    ratings:[{star:Number,
        postedby:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
    }
         
    ]

},{timestamps:true})

module.exports= mongoose.model("Product",productSchema)