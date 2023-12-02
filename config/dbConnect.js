const { default: mongoose } = require("mongoose")
const dotenv = require('dotenv').config()
const PASSWORD = process.env.PASSWORD

const dbConnect = ( ) =>{
    try{
        const conn =mongoose.connect(PASSWORD)
        console.log("Database connect")

    } catch (error)
    {
            console.log("Database error")
    }
}

module.exports = dbConnect