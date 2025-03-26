import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { addToCart, userCart, updateCart, removeProductFromCart, clearCart } from "./cart.controller.js";
// import { isValid } from "../../middleware/validation.middleware.js";
// import { cartSchema, removeProductFromCartSchema } from "./cart.validation.js";

const router = Router()

// CRUD
// add product cart
//router.post("/" , isAuthenticated , isValid(cartSchema) , addToCart)
router.post("/" , isAuthenticated , addToCart)


// user cart
router.get("/" , isAuthenticated , userCart)

// update cart
// router.patch("/" , isAuthenticated , isValid(cartSchema) ,updateCart)
router.patch("/" , isAuthenticated ,updateCart)



// clear cart
router.put("/clear" , isAuthenticated , clearCart)


// remove product from cart
// router.patch("/:productid" , isAuthenticated , isValid(removeProductFromCartSchema) , removeProductFromCart)
router.patch("/:productid" , isAuthenticated , removeProductFromCart)



export default router 