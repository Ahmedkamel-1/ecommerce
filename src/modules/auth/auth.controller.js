import { Cart } from "../../../DB/models/cart.model.js";
import { Token } from "../../../DB/models/token.model.js";
import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { signUpTemp , resetPassTemp} from "../../utils/generatehtml.js";
import { sendEmail } from "../../utils/sendEmails.js";
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import randomstring from "randomstring";


// register
export const register = asyncHandler(async (req,res,next)=> {
     // data from request
     const { userName , email , password } = req.body
     // check user existance
     const isUser = await User.findOne({email})
     if(isUser) {
          return next(new Error ("Email already exist" , {cause:409}))
     }
     // hash password
     const hashedPassword = bcryptjs.hashSync(password , Number(process.env.SALT_ROUND))
     // generate activation code
     const activationCode = crypto.randomBytes(64).toString('hex')
     // create user
     const user = await User.create({userName , email , password:hashedPassword , activationCode})
     // confirmation link
     const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`
     // send email
     const isSent = await sendEmail({to:email ,subject:"Activate Account", html:signUpTemp(link)})
     // send response
     return isSent ? res.json({success:true , message: "Please review your Email!"}) : next (new Error("Something went wrong!"))
})

// activate account
export const activateAccount = asyncHandler(async(req,res,next)=> {
     // find user , delete the activationCode  , update isConfirmed
     const user = await User.findOneAndUpdate({activationCode : req.params.activationCode} ,
          {isConfirmed: true , $unset: {activationCode: 1}}
     )
     // check if the user doesn't exist
     if(!user) return next(new Error("User not Found!" , {cause:404}))
     // create cart
     await Cart.create({ user: user._id })
     // send response
     return res.json("Your Account activated successfully")
})

// login
export const login = asyncHandler(async(req,res,next)=> {
     // data
     const { email , password } = req.body
     // check user existencs
     const user = await User.findOne({email})
     if(!user){
          return next(new Error("invalid Email!", {cause :400}))
     }
     if(!user.isConfirmed) 
          return next(new Error("un activated Account!" , {cause :400}))
     // check password
     const match = bcryptjs.compareSync(password , user.password)
     if(!match)
          return next(new Error("invalid Password!" , {cause:400}))
     // generate token
     const token = jwt.sign({id:user._id , email:user.email} , process.env.TOKEN_KEY)
     // save token in token model
     await Token.create({token, user:user._id , agent: req.headers["user-agent"]})
     // change user status to online
     user.status = "online"
     await user.save()
     // send response
     return res.json({success:true , results:token})
})

// forget code
export const sendForgetCode = asyncHandler(async(req,res,next)=> {
     // check user
     const user = await User.findOne({ email:req.body.email })
     if(!user) return next (new Error("invalid Email!"))
     // generate code
     const code = randomstring.generate({
          length:5,
          charset:"numeric"
     })
     // save code in DB
     user.forgetCode = code
     await user.save()
     // send email
     return await sendEmail({to:user.email , subject:'Reset password' , html:resetPassTemp(code)}) ? res.json({success:true , message:"Check your Email"}) : next(new Error("Something went wrong!"))
})

// reset password
export const resetPassword = asyncHandler(async(req,res,next) => {
     // check user
     let user = await User.findOne({forgetCode : req.body.forgetCode})
     if(!user) return next(new Error("invalid Email!"))
     // check code
     if(user.forgetCode !== req.body.forgetCode) return next(new Error("invalid code!"))
     user = await User.findOneAndUpdate({email: req.body.email} , {$unset : {forgetCode : 1}})
     // hash password
     user.password = bcryptjs.hashSync(req.body.password , Number(process.env.SALT_ROUND))
     // save user
     await user.save()
     // invalidate tokens
     const tokens = await Token.find({user: user._id})
     tokens.forEach(async(token)=>{
          token.isValid = false
          await token.save()
     })
     // send response
     res.json({success: true , message: "Try to Login Now!"})
})