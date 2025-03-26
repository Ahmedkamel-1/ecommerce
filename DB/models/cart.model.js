import mongoose, { model, Schema, Types } from "mongoose";

// schema
const cartSchema = new Schema({
    user :{
        type: Types.ObjectId,
        ref: "User",
        unique: true,
        required:true
    }, products : [
        {
            productid :{ type: Types.ObjectId, ref: "Product"} 
            ,quantity :{ type : Number, default : 1}
        }
    ]
} , {timestamps:true})


// model
export const Cart = mongoose.models.Cart || model("Cart" , cartSchema)