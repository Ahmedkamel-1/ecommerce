import mongoose, { model, Schema, Types } from "mongoose";

// schema
const categorySchema = new Schema({
    name: {
        type:String,
        required:true,
        min:4,
        max:15
    },slug: {
        type: String,
        required:true,
    },image : {
        url: {type:String , required:true},
        id: {type:String , required:true}
    },
    createdBy: {type:Types.ObjectId , ref:"User" , required:true},
    brandid: {
        type : Types.ObjectId,
        ref:"Brand"
    }
} , { timestamps:true, toJSON: {virtuals:true}, toObject: {virtuals:true} })

// populate virtual with subcategory
categorySchema.virtual('subcategory' , {
    ref: 'Subcategory',
    localField: '_id',
    foreignField: 'categoryid'
})

// model
export const Category = mongoose.models.Category ||  model("Category" , categorySchema)