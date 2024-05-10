
const express=require('express')
const dbConnect = require('./config/dbConnect')
const app =express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const authRouter=require("./routes/authRoute")
const productRouter = require("./routes/productRoute")
const coupoRouter = require("./routes/coupoRoute")
const blogRouter = require("./routes/blogRoutes")
const categoryRouter = require("./routes/prodcategoryRoute")
const brandRouter = require("./routes/brandRoute")
const bcategoryRouter = require("./routes/blogCatRoute")
const bodyParser = require('body-parser')
const { notFound, errorHandler } = require('./middlewares/erroHandler')
const cookieParser =require("cookie-parser")
const morgan=require('morgan')

const cors = require("cors")


dbConnect()

app.use(cors());
app.options('*', cors())

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())


app.use("/api/user", authRouter)
app.use("/api/product", productRouter )
app.use("/api/blog", blogRouter)
app.use("/api/category", categoryRouter)
app.use("/api/bcategory", bcategoryRouter)
app.use("/api/coupon", coupoRouter)
app.use("/api/brand", brandRouter)


app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => 
{
    console.log('H Server is s running at port ' + PORT)
})