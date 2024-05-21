
const express=require('express')
const dbConnect = require('./config/dbConnect')
const app =express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const authRouter=require("./routes/authRoute")
const productRouter = require("./routes/productRoute")
const workerRouter = require("./routes/workerRoute")
const coupoRouter = require("./routes/coupoRoute")
const blogRouter = require("./routes/blogRoutes")
const categoryRouter = require("./routes/prodcategoryRoute")
const brandRouter = require("./routes/brandRoute")
const colorRouter = require("./routes/colorRoute")
const uploadRouter = require("./routes/uploadRoute")
const bancoRouter = require("./routes/bancoRoute")
const enquiryRouter = require("./routes/enqRoute")

const bcategoryRouter = require("./routes/blogCatRoute")
const wcategoryRouter = require("./routes/wcateRoute")
const bodyParser = require('body-parser')
const { notFound, errorHandler } = require('./middlewares/erroHandler')
const cookieParser =require("cookie-parser")
const morgan=require('morgan')

const cors = require("cors")


dbConnect()
const allowedOrigins = ['http://localhost:5173', 'https://www.crsleon.info'];
app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como las de herramientas locales)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

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
app.use("/api/color", colorRouter)
app.use("/api/enquiry", enquiryRouter)
app.use("/api/upload",uploadRouter)
app.use("/api/worker",workerRouter)
app.use("/api/banco",bancoRouter)
app.use("/api/wcategory",wcategoryRouter)


app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => 
{
    console.log('H Server is s running at port ' + PORT)
})