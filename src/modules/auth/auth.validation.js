// import joi from 'joi'

// // Register
// export const registerSchema = joi.object({
//      userName: joi.string().min().max().required(),
//      email: joi.string().email().required(),
//      password:joi.string().required(),
//      confirmPassword: joi.string().valid(joi.ref('password')).required()
// }).required()

// // activate account
// export const activateSchema = joi.object({
//      activationCode : joi.string().required()
// }).required()

// login
// export const loginSchema = joi.object({
//     email: joi.string().email().required(),
//     password: joi.string().required()
// }).required()

// send forget code
// export const forgetCodeSchema = join.object({
//     email : join.string().email().required()
// }).required()

// reset password
// export const resetPasswordSchema = joi.object({
//     forgetCode: joi.string().required(),
//     password: joi.string().required(),
//     confirmPassword: joi.string().valid(joi.ref('password')).required()
// }).required()