import { isValidObjectid } from "../../middleware/validation.middleware.js";


// create
export const createSubCategorySchema = joi.object({
    name:joi.string().min(5).max(20).required(),
    categoryid: joi.string().custom(isValidObjectid).required()
}).required()

// update
export const updateSubCategorySchema = joi.object({
    categoryid: joi.string().custom(isValidObjectid).required(),
    subcategoryid: joi.string().custom(isValidObjectid).required(),
    name:joi.string().min(5).max(20)
}).required()


// delete
export const deleteSubCategorySchema = joi.object({
    categoryid: joi.string().custom(isValidObjectid).required(),
    subcategoryid: joi.string().custom(isValidObjectid).required(),
}).required()