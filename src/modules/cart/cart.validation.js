// import joi from "joi"
import { isValidObjectid } from "../../middleware/validation.middleware.js";

// add to cart and update cart
export const cartSchema = joi.object({
    productid: joi.string().custom(isValidObjectid).required(),
    quantity: joi.number().integer().min(1).required()
}).required()


// remove product from cart
export const removeProductFromCartSchema = joi.object({
    productid: joi.string().custom(isValidObjectid).required()
}).required()