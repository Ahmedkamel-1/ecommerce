//import joi from 'joi'

import { isValidObjectid } from "../../middleware/validation.middleware.js"

// create category
export const createCategorySchema = joi.object({
    name: joi.string().min(4).max(15).required(),
    createdBy: joi.string().custom(isValidObjectid)
}).required()


// update category
export const updateCategorySchema = joi.object({
    name: joi.string().min(4).max(15),
    categoryid: joi.string().custom(isValidObjectid)
}).required()


// delete category
export const deleteBrandSchema = joi.object({
    categoryid: joi.string().custom(isValidObjectid)
}).required()