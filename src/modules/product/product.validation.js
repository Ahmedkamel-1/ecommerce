//import joi from 'joi'
import { isValidObjectid } from "../../middleware/validation.middleware.js"

// create product
export const createProductSchema = joi.object({
    name: joi.string().min(3).max(20).required(),
    description: joi.string(),
    availableitems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(isValidObjectid),
    subcategory: joi.string().custom(isValidObjectid),
    brand: joi.string().custom(isValidObjectid),
}).required()


// update product
export const updateProductSchema = joi.object({
    name: joi.string().min(4).max(15),
    categoryid: joi.string().custom(isValidObjectid)
}).required()


//  product id schema
export const productidSchema = joi.object({
    categoryid: joi.string().custom(isValidObjectid)
}).required()
