import { Cart } from "../../../DB/models/cart.model.js"
import { Product } from "../../../DB/models/product.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"

// add to cart
export const addToCart = asyncHandler( async(req,res,next) => {
    // data
    const { productid , quantity } = req.body
    // check product
    const product = await Product.findById(productid)
    if(!product) return next(new Error("Product not found!"))
    // check stock
    if(!product.inStock(quantity)){
        return next(new Error(`Sorry, there is only ${product.availableitems} of ${product.name} left!`))
    }
    // check the product existence in the cart 
    // add to cart
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id }, 
        { $push : { products: { productid , quantity }}},
        { new: true, upsert: true }
    )
    // const cart = await Cart.findOne({ user: req.user._id })
    // console.log(req.user._id)
    if(!cart) {
        return next(new Error("invalid cart"))
    }
    // response
    return res.json({success:true , results: cart , message: "Product added successfully!"})
})


// user cart
export const userCart = asyncHandler( async (req,res,next) => {
    const cart = await Cart.findOne({user: req.user._id}).populate({path: "products.productid" , select: "name defaultimage.url price discount finalPrice" })
    return res.json({success:true , results: cart})
})


// update cart
export const updateCart = asyncHandler( async (req,res,next) => {
    // data
    const { productid , quantity } = req.body
    // check product
    const product = await Product.findById(productid)
    if(!product) return next(new Error("Product not found!"))
    // check stock
    if(!product.inStock(quantity)){
        return next(new Error(`Sorry, there is only ${product.availableitems} of ${product.name} left!`))
    }
    // update product
    // const cart = await Cart.findOneAndUpdate({ user: req.user._id , "products.productid" : productid } , { $set: {"products.$.quantity": quantity}}, {new:true} )
    const isProductinCart = await Cart.findOne({
        user:req.user._id,
        "products.productid": productid
    })
    if(isProductinCart){
        isProductinCart.products.forEach((productObj)=>{
            if(productObj.productid.toString() === productid.toString() && productObj.quantity + quantity < product.availableitems ){
                productObj.quantity = productObj.quantity + quantity
            }
        })
        await isProductinCart.save()
        // response
        return res.json({
            success:true,
            results: isProductinCart,
            message: "Product added successfully!"
        })
    }else {
        const cart = await Cart.findOneAndUpdate({ user: req.user._id , "products.productid" : productid } , { $set: {"products.$.quantity": quantity}}, {new:true} )
    }
    // send response
    return res.json({success:true , results:cart})
})


// remove product from cart
export const removeProductFromCart = asyncHandler( async (req,res,next) => {
    // remove
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        { $pull: { products: {productid: req.params.productid} } },
        { new:true }
    )
    // response
    return res.json({success:true , results:cart , message:"Product removed successfully!"})
})


// clear cart
export const clearCart = asyncHandler( async (req,res,next) => {
    const cart = await Cart.findOne({user: req.user._id } , {products: []}, { new:true })
    // response
    return res.json({success:true , results:cart , message:"cart cleared!"})
})