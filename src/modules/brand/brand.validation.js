//import joi from 'joi'
import { isValidObjectid } from "../../middleware/validation.middleware.js"

// create brand
export const createBrandSchema = joi.object({
    name: joi.string().min(4).max(15).required(),
}).required()


// update brand
export const updateBrandSchema = joi.object({
    name: joi.string().min(4).max(15),
    brandid: joi.string().custom(isValidObjectid).required()
}).required()


// delete brand
export const deleteCategorySchema = joi.object({
    brandid: joi.string().custom(isValidObjectid).required()
}).required()