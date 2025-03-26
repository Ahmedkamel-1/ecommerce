import { Router } from "express";
import { createCoupon, updateCoupon, deleteCoupon, allCoupons } from "./coupon.controller.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
//import { isValid } from "../../middleware/validation.middleware.js";
//import { createCouponSchema, updateCouponSchema, deleteCouponSchema } from "./coupon.validation.js";

const router = Router()

// CRUD

//create
//router.post('/' , isAuthenticated , isAuthorized("admin") , isValid(createCouponSchema) , createCoupon)
router.post('/' , isAuthenticated , isAuthorized("admin")  , createCoupon)


// update
//router.patch('/:code' , isAuthenticated , isAuthorized("admin") , isValid(updateCouponSchema)  , updateCoupon)
router.patch('/:code' , isAuthenticated , isAuthorized("admin")  , updateCoupon)


// delete
//router.delete('/:code' , isAuthenticated , isAuthorized("admin") , isValid(deleteCouponSchema)  , deleteCoupon)
router.delete('/:code' , isAuthenticated , isAuthorized("admin")  , deleteCoupon)


// all coupons
router.get('/' , isAuthenticated , isAuthorized("admin")  , allCoupons)



export default router
