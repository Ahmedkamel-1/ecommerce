import mongoose, { model, Schema, Types } from "mongoose";


// Schema
const tokenSchema = new Schema({
     token: {
          type: String,
          required: true
     },user: {
          type: Types.ObjectId,
          ref: 'User'
     },isValid: {
          type: Boolean,
          default: true
     },agent : String,
     expiredAt: String
} , {timestamps:true})


// Model
export const Token = mongoose.model.Token || model('Token', tokenSchema)