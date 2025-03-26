import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { createOrder, cancelOrder } from "./order.controller.js";
//import { createOrderSchema } from "./order.validation.js";
//import { isValid } from "../../middleware/validation.middleware.js"

const router = Router()

// create order
// router.post("/" , isAuthenticated , isValid(createOrderSchema) , createOrder )
router.post("/" , isAuthenticated , createOrder )


// cancel order
// router.patch('/:orderid' , isAuthenticated , isValid(cancelOrderSchema), cancelOrder)
router.patch('/:orderid' , isAuthenticated , cancelOrder)


export default router