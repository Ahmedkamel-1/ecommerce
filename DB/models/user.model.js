import mongoose, { model, Schema } from "mongoose";

// Schema
const userSchema = new Schema({
     userName: {
          type:String,
          required:true,
          min:3,
          max:20
     },email: {
          type :String,
          unique: true,
          required:true,
          lowercase:true
     },password: {
          type: String,
          requred:true
     },gender: {
          type:String,
          enum: ['male' , 'female']
     },phoen : String,
     status: {
          type: String,
          enum : ['online' , 'offline'],
          default: 'offline'
     },role: {
          type: String,
          enum: ['admin' , 'user'],
          default: 'user'
     },isConfirmed : {
          type: Boolean,
          default: false
     },forgetCode: String,
     activationCode:String,
     profileimage: {
          url: {
               type: String,
               default: 'https://res.cloudinary.com/deguhwavz/image/upload/v1729263785/user_alwyjr.jpg'
          },
          id: {
               type: String,
               default:'user_alwyjr'
          }
     }, coverimages : [
          { url: 
               {type:String , required:true}
               ,id :
                    {type:String , required:true}
          }
     ]
} , {timestamps:true})


// Model
export const User = mongoose.model.User || model('User' , userSchema)