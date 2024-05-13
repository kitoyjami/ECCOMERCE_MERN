const { generateToken } = require("../config/jwtToken")
const User=require("../models/userModel")
const Product=require("../models/productModel")
const Cart =require("../models/cartModel")
const Coupon = require("../models/couponModel")
const Order = require("../models/orderModel")

var uniqid = require("uniqid")

const asyncHandler=require('express-async-handler')
const validateMongoDbId =require("../utils/validateMongodbid")
const {generateRefreshToken} =require("../config/refreshtoken")
const jwt=require("jsonwebtoken")
const crypto = require("crypto")
const sendEmail = require("./emailCrl")

const createUser =asyncHandler(async (req,res) => {

    const email = req.body.email
    const findUser = await User.findOne({email:email})
    if (!findUser)
    {
        const newUser = await User.create(req.body)
        res.json(newUser)   
    }else {
        throw new Error ('User Already Exist')
    }
})

const loginUserCtlr=asyncHandler(async (req,res)=> {
    const {email,password} =req.body
    // check if user exist or not 
    const findUser=await User.findOne({email})
    if(findUser && await findUser.isPasswordMatched(password))
    {
        const refreshToken=await generateRefreshToken(findUser?._id)
        const updateuser=await User.findByIdAndUpdate(
            findUser.id,
            {
            refreshToken:refreshToken
            },
            {new:true}
        )
        
        res.cookie('refreshToken', refreshToken,{
            httpOnly:true,
            maxAge: 72*60*60*1000,
        }) 

        res.json({
            _id : findUser?.id,
            firstname: findUser?.firstname,
            lasttname: findUser?.lasttname,
            email : findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)

        })
    }else {
        throw new Error("Invalid Crendential")
    }
})

//handle refresh token

const handleRefreshTOken =asyncHandler (async (req,res) =>{
    const cookie=req.cookies
    console.log(cookie)
    if(!cookie?.refreshToken) throw new Error ("No Refresh token in cookies")
    const refreshToken =cookie.refreshToken
    console.log(refreshToken)
    const user= await User.findOne({refreshToken})
    if(!user) throw new Error('No refresh token present in db')
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id !==decoded.id){
            throw new Error('There is something wrong with refresh token')
        }
        const accessToken= generateToken(user?._id)
        res.json({accessToken})
    })

    
})

// logout functionality

const logout = asyncHandler (async (req,res)=>{
    const cookie =req.cookies
    if(!cookie?.refreshToken) throw new Error ("No Refresh token in cookies")
    const refreshToken =cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user){
        res.clearCookie('refreshToken', {
            httpOnly:true,
            secure:true, 
        })
        return res.sendStatus(204) //forbidden
    }
    await User.findOneAndUpdate({refreshToken},{
        refreshToken:""
    })
    res.clearCookie('refreshToken', {
        httpOnly:true,
        secure:true, 
    })
    return res.sendStatus(204) //forbidden
    

})

// GET ALL USERS

const getAllUser= asyncHandler(async (req,res)=>{
    console.log(req.params)
    try {
        const getUsers=await User.find()
        res.json(getUsers)
    }catch(error){
        throw new Error(error)
    }
})

const getaUser= asyncHandler(async (req,res)=>{
    const {id} =req.params
    validateMongoDbId(id)
    try {
        
        const getaUser=await User.findById(id)
        res.json({
            getaUser
        })
    }catch(error){
        throw new Error(error)
    }
})

const deleteaUser= asyncHandler(async (req,res)=>{
    const {id} =req.params
    validateMongoDbId(id)
    try {
        
        const deleteaUser=await User.findByIdAndDelete(id)
        res.json({
            deleteaUser
        })
    }catch(error){
        throw new Error(error)
    }
})

const updateaUser= asyncHandler(async (req,res)=>{
    
    const {_id} =req.user
    validateMongoDbId(_id)
    try {
        
        const updateaUser=await User.findByIdAndUpdate(_id,{
            firstname: req?.body?.firstname,
            lasttname: req?.body?.lasttname,
            email:  req?.body?.email,
            mobile: req?.body?.mobile
        },
        {
            new:true,

        })
        res.json({
            updateaUser
        })
    }catch(error){
        throw new Error(error)
    }
})

const blockUser = asyncHandler (async (req,res) =>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const block= await User.findByIdAndUpdate(id,{isBLocked: true
        }, {new : true})
        res.json(
            {
                msg: "User blocked"
            }
        )
    }catch(error){
        throw new Error(error)
    }


})

const unblockUser = asyncHandler (async (req,res) =>{
    const {id}=req.params
    validateMongoDbId(id)
    try{
        const block=await User.findByIdAndUpdate(id,{isBLocked: false
        }, {new : true})
    }catch(error){
        throw new Error(error)
    }
    res.json(
        {
            msg: "User Unblocked"
        }
    )
})

const updatePassword = asyncHandler(async(req,res)=>{
    const{_id}=req.user
    const {password}=req.body
    console.log(_id)
    validateMongoDbId(_id)
    const user =  await User.findById(_id)
    console.log(user)
    if(password){
        user.password=password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    }
    else {
        res.json(user)
    }
})

const forgotPasswordToken = asyncHandler(async (req,res)=>{
    const {email}=req.body
    const user = await User.findOne({email})
    if(!user) throw new Error("User not found with this email")
    try{
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `Hi, Please follor his link to reset Your Password.
        This linkd is valid till 10 minutes from now. 
        <a href='http://localhost:4000/api/user/reset-password/${token}'> Click Here</a>`
        const data={
            to: email,
            text:"Hey User",
            subject:"Forgot Password",
            htm:resetURL

            }
            sendEmail(data)
            res.json(token)
        }
        catch(error){
            throw new Error(error)
        }
    }
)

const resetPassword =asyncHandler (async (req,res)=>{
    const {password} =req.body
    const {token} =req.params
    const hashedToken=crypto.createHash('sha256').update(token).digest("hex")
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt : Date.now()}
    })
    if(!user) throw new Error("Token Expired, Please try again later")
    user.password=password
    user.passwordResetToken=undefined
    user.passwordResetExpires=undefined
    await user.save()
    res.json(user)
})


const getWishList = asyncHandler(async(req,res)=>{
    const {_id}=req.user
    try{
        const findUser = await User.findById(_id).populate("wishlists")
        res.json(findUser)

    }catch(error){
        throw new Error(error)
    }
})

const saveAddress = asyncHandler(async (req,res,next)=>{
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        const updateaUser=await User.findByIdAndUpdate(_id,{
            addres: req?.body?.addres
        },
        {
            new:true,

        })
        res.json({
            updateaUser
        })

    }catch(error){
        throw new Error(error)
    }
})

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        // Buscar el usuario
        const user = await User.findById(_id);

        // Verificar si el usuario ya tiene un carrito
        let existingCart = await Cart.findOne({ orderby: user._id });

        // Si hay un carrito existente, actualizarlo
        if (existingCart) {
            // Actualizar los productos en el carrito existente
            existingCart.products = [];

            for (const item of cart) {
                const product = await Product.findById(item._id);

                if (!product) {
                    return res.status(400).json({ message: `Product with ID ${item._id} not found.` });
                }

                existingCart.products.push({
                    product: item._id,
                    count: item.count,
                    color: item.color,
                    price: product.price
                });
            }

            existingCart.cartTotal = calculateCartTotal(existingCart.products);
            await existingCart.save();
            return res.json(existingCart);
        }

        // Si no hay un carrito existente, crear uno nuevo s
        const products = [];
        for (const item of cart) {
            const product = await Product.findById(item._id);

            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item._id} not found.` });
            }

            products.push({
                product: item._id,
                count: item.count,
                color: item.color,
                price: product.price
            });
        }

        const cartTotal = calculateCartTotal(products);
        const newCart = await new Cart({
            products,
            cartTotal,
            orderby: user._id
        }).save();

        res.json(newCart);
    } catch (error) {
        console.error("Error updating user cart:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Función para calcular el total del carrito
function calculateCartTotal(products) {
    let total = 0;
    for (const product of products) {
        total += product.price * product.count;
    }
    return total;
}


const getUserCart = asyncHandler(async(req,res)=>{
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        const cart = await Cart.findOne({orderby:_id}).populate("products.product")
        res.json(cart)
    }catch (error){
        throw new  Error(error)
    }
})

const emptyCart = asyncHandler(async(req,res)=>{
    const {_id}=req.user
    validateMongoDbId(_id)
    try{
        const user= await User.findOne({_id})
        const cart = await Cart.findOneAndDelete({orderby:_id})
        res.json(cart)
    }catch (error){
        throw new  Error(error)
    }
})

const applyCoupon = asyncHandler(async (req,res)=>{
    const {coupon} = req.body
    const {_id}=req.user
    validateMongoDbId(_id)
    const validCoupon = await Coupon.findOne({name:coupon})
    if(validCoupon===null){
        throw new Error("Invalid Coupon")
    }
    const user =await User.findOne({_id})
    let {products,cartTotal}=await Cart.findOne({orderby:user._id}).populate("products.product")
    let totalAfterDiscount=(cartTotal - (cartTotal*validCoupon.discount/100)).toFixed(2)
    await Cart.findOneAndUpdate({orderby:user._id},{totalAfterDiscount},{new:true})
    res.json(totalAfterDiscount)
})

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        if (!COD) {
            throw new Error('Create cash order failed');
        }

        // Obtener el carrito del usuario
        const userCart = await Cart.findOne({ orderby: _id });

        if (!userCart) {
            return res.status(400).json({ message: "User's cart not found" });
        }

        // Calcular finalAmount basado en el carrito actualizado
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        // Obtener la orden activa del usuario
        let existingOrder = await Order.findOne({ orderby: _id, orderStatus: "Cash on Delivery" });

        if (existingOrder) {
            // Actualizar la orden existente
            existingOrder.products = userCart.products;
            existingOrder.paymentIntent.method = "COD";
            existingOrder.paymentIntent.amount = finalAmount;
            existingOrder.orderStatus = "Cash on Delivery";
            existingOrder.updatedAt = Date.now();

            // Guardar la orden actualizada
            await existingOrder.save();

            res.json({ message: "Order updated successfully", order: existingOrder });
        } else {
            // Crear una nueva orden
            const newOrder = await new Order({
                products: userCart.products,
                paymentIntent: {
                    id: uniqid(),
                    method: "COD",
                    amount: finalAmount,
                    status: "Cash on Delivery",
                    created: Date.now(),
                    currency: "usd",
                },
                orderby: _id,
                orderStatus: "Cash on Delivery"
            }).save();

            // Actualizar la cantidad de productos vendidos en la base de datos
            const updateProducts = userCart.products.map(async (item) => {
                const product = await Product.findById(item.product._id);
                product.quantity -= item.count;
                product.sold += item.count;
                await product.save();
            });
            await Promise.all(updateProducts);

            res.json({ message: "Order created successfully", order: newOrder });
        }
    } catch (error) {
        console.error("Error creating/updating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



function calculateFinalAmount(cart, couponApplied) {
    let finalAmount = 0;

    if (couponApplied && cart.totalAfterDiscount) {
        finalAmount = cart.totalAfterDiscount;
    } else {
        finalAmount = cart.cartTotal;
    }

    return finalAmount;
}

const getOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const userOrders = await Order.findOne({ orderby: _id }).populate("products.product").populate('orderby').exec();

        if (!userOrders) {
            return res.status(404).json({ message: 'No orders found for the user.' });
        }

        res.json(userOrders);
    } catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

const getAllOrder = asyncHandler(async (req, res) => {
    try {
        const alluserOrders = await Order.find().populate("products.product").populate('orderby').exec();
        res.json(alluserOrders);
    } catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


const updateOrderStatus = asyncHandler(async (req, res) => {

    const { newStatus } = req.body;
    const {id}=req.params
    console.log("hola1", newStatus)
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id,{
            orderStatus:newStatus,
            paymentIntent:{
                status:newStatus
            }
        });

        res.json({ message: "Order status updated successfully", updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({ message: "Error updating order status" });
    }
});


module.exports = {
    createUser,
    loginUserCtlr,
    getAllUser,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshTOken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrder,
    updateOrderStatus,
    getAllOrder
}