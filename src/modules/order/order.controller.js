import { Cart } from "../../../DB/models/cart.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { createInvoice } from "./../../utils/createinvoice.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileURLToPath } from 'url'
import path from 'path'
import cloudinary from "../../utils/cloud.js";
import { sendEmail } from "../../utils/sendEmails.js";
import { clearCart, updateStock } from "./order.service.js";
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url))


// create
export const createOrder = asyncHandler( async (req,res,next) => {
    // data
    const { payment, address, coupon, phone } = req.body
    // check coupon
    let checkCoupon;
    if(coupon) {
        //checkCoupon = await Coupon.findOne({ name:coupon , expiredAt: {$gt:Date.now() } })
        checkCoupon = await Coupon.findOne({ name:coupon })
        if(!coupon) return next(new Error("invalid coupon!"))
    }
    // check cart
    const cart = await Cart.findOne({ user:req.user._id })
    const products = cart.products
    if(products.length < 1 ) return next(new Error("Empty cart!"))
    let orderProducts = []
    let orderPrice = 0
    // check products
    for (let i = 0; i < products.length; i++) {
        // check product existence
        const product = await Product.findById(products[i].productid)
        if(!product) return next(new Error(`product ${products[i].productid} not found `))
        // check product stock
        if(!product.inStock(products[i].quantity)) return next(new Error(`${product.name} out of stock , only ${product.availableitems} items left!`))
        orderProducts.push({
            productid: product._id, 
            quantity: products[i].quantity,
            name: product.name,
            itemPrice: product.finalPrice,
            totalPrice: products[i].quantity * product.finalPrice
        })
        orderPrice += products[i].quantity * product.finalPrice
    }
    // create order
    const order = await Order.create({
        user: req.user._id,
        products: orderProducts,
        address,
        phone,
        coupon: {
            id: checkCoupon?._id,
            name: checkCoupon?.name,
            discount: checkCoupon?.discount
        },
        // coupon: checkCoupon ? {
        //     id: checkCoupon._id,
        //     name: checkCoupon.name,
        //     discount:checkCoupon.discount
        // }: null,
        payment,
        price: orderPrice,
    })

    // generate invoice
    const user = req.user
    const invoice = {
        shipping: {
            name: user.userName,
            address: order.status,
            country:"Egypt"
        },
        items: order.products,
        subtotal: order.price,
        paid: order.finalPrice,
        invoice_nr: order._id
    }
    const pdfPath = path.join(__dirname , `./../../../invoiceTemp/${order._id}.pdf`)
    createInvoice(invoice , pdfPath)
    // upload cloudinary
    const { secure_url , public_id } = await cloudinary.uploader.upload(pdfPath , {
        folder: `${process.env.FOLDER_CLOUD_NAME}/order/invoice/${user._id}`
    })
    // TODO delete file from filesystem
    // add invoice to order
    order.invoice = {id:public_id , url:secure_url}
    await order.save()
    updateStock(order.products, true)
    // clear cart
    clearCart(user._id)
    // send email

    const isSent = await sendEmail({
        to:user.email,
        subject:'Order invoice',
        attachments: [{
            path:secure_url,
            contentType: 'application/pdf'
        }]
        
    })
    console.log("secureurl :" , secure_url)
    console.log("attachments: " , attachments)
    console.log("📧 Email Sent Statusssss:", isSent);
    if(isSent) {
        // update stock
        updateStock(order.products , true)
        // clear cart
        clearCart(user._id)
    }
    
    // Strip Payment
    if(payment === 'visa') {
        const stripe = new Stripe(process.env.STRiPE_KEY)
        let existCoupon
        if (order.coupon && order.coupon.name) { 
            existCoupon = await stripe.coupons.create({
                percent_off: order.coupon.discount,
                duration:"once"
            })
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
            line_items: order.products.map((product) => {
                return {
                    price_data: {  // ✅ Corrected
                        currency: "EGP",
                        product_data: {  // ✅ Corrected
                            name: product.name,
                            images: product.productid.defaultimage ? [product.productid.defaultimage.url] : [],
                        },
                        unit_amount: product.itemPrice * 100,
                    },
                    quantity: product.quantity
                };
            }),
            discounts: existCoupon ? [{ coupon: existCoupon.id }] : [],
        });
        return res.json({success:true , result:session.url})
    }
    // response
    return res.json({success:true , message:"order placed successfully , check your Email" })
})


// cancel
export const cancelOrder = asyncHandler(async (req,res,next) => {
    // check order
    const order = await Order.findById(req.params.orderid)
    if(!order) return next(new Error("Order not Found!"))
    if(order.status === 'shipped' || order.status === 'delivered'){
        return next(new Error("Can't cancel the order!"))
    }
    order.status = "canceled"
    await order.save()
    updateStock(order.products ,false)
    // response
    return res.json({success:true , message:"Order deleted successfully!"})
})

