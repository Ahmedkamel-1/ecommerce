import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthorized = ((role)=>{
    return asyncHandler ((req,res,next)=>{
        // check user
        if(role !== req.user.role) return next(new Error("You aren't Authorized" , {cause:403}))
        return next()
    })
})