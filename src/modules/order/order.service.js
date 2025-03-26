import { Cart } from "../../../DB/models/cart.model.js"
import { Product } from "../../../DB/models/product.model.js"

// clear cart
export const clearCart = async(userid)=> {
    await Cart.findOneAndUpdate({ user:userid },{ products:[] })
}

// update stock
export const updateStock = async (products , placeOrder) => {
    // to reuse this function in create and cancel order
    // placeOrder >>> true , false
    // true >>> place order
    // false >>> calcel order
    if(placeOrder) {
        for (const product of products) {
            await Product.findByIdAndUpdate(product.productid , {
                $inc: {
                    availableitems: -product.quantity,
                    solditems: product.quantity
                }
            })
        }
    }else {
        for (const product of products) {
            await Product.findByIdAndUpdate(product.productid , {
                $inc: {
                    availableitems: product.quantity,
                    solditems: -product.quantity
                }
            })
        }
    }
}