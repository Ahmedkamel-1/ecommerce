import mongoose, { Schema, Types, model }from "mongoose";


// schema
const subCategorySchema = new Schema({
    name: {
        type:String,
        required:true,
        min:5,
        max:20
    },slug: {
        type:String,
        required:true
    },image: {
        id:{ type:String , required: true},
        url:{ type: String , required:true}
    },categoryid: {
        type: Types.ObjectId,
        ref:"Category",
        required:true
    }, createdBy: {
        type:Types.ObjectId,
        ref:"User",
        required:true
    }, brand: [{
            type : Types.ObjectId,
            ref:"Brand"
        }]
} , {timestamps:true})

// model
export const Subcategory = mongoose.models.Subcategory ||  model("Subcategory" , subCategorySchema)