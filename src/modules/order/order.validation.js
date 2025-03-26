// import joi from 'joi'

//import { isValidObjectid } from "../../middleware/validation.middleware.js"


// create
export const createOrderSchema = joi.object({
    address: joi.string().min(10).required(),
    coupon: joi.string().length(5),
    phone: joi.string().length(11).required(),
    payment: joi.string().valid('cash' , 'visa').required(),
}).required()


// cancel
export const cancelOrderSchema = joi.object({
    orderid: joi.string().custom(isValidObjectid).required()
}).required()

