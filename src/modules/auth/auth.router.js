import { Router } from 'express'
//import { isValid } from '../../middleware/validation.middleware.js'
//import { activateSchema, registerSchema , loginSchema , forgetCodeSchema , resetPasswordSchema} from './user.validation.js'
import { activateAccount, login, register, sendForgetCode , resetPassword } from './auth.controller.js'

const router = Router()

// Register
//router.post('/register' , isValid(registerSchema) , register)
router.post('/register'  , register)

// Activation Account
// router.get('/confirmEmail/:activationCode' , isValid(activateSchema) , activateAccount)
router.get('/confirmEmail/:activationCode' , activateAccount)

// Login
// router.post("/login" , isValid(loginSchema) , login)
router.post("/login"  , login)

// send forget password code
// router.patch('/forgetcode' , isValid(forgetCodeSchema) , sendForgetCode)
router.patch('/forgetcode' ,  sendForgetCode)

// Reset Password
// router.patch("/resetPassword" , isValid(resetPasswordSchema) , resetPassword)
router.patch("/resetPassword" , resetPassword)

export default router