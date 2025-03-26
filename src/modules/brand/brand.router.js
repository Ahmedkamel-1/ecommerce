import { Router } from 'express'
// import { isValid } from '../../middleware/validation.middleware.js'
// import { updateBrandSchema  , createBrandSchema , deleteBrandSchema } from './brand.validation.js'
import { createBrand , updateBrand , deleteBrand , allBrands } from './brand.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js'
import { fileUpload, filterObject } from '../../utils/multer.js'

const router = Router()

// create brand
// router.post("/" , isAuthenticated, isAuthorized("admin") , fileUpload(filterObject.image).single("brand") ,isValid(createBrandSchema) , createBrand)
router.post("/" , isAuthenticated, isAuthorized("admin") , fileUpload(filterObject.image).single("brand")  , createBrand)

// update brand
// router.patch("/brandid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("category") , isValid(updateBrandSchema) , updateBrand)
router.patch("/:brandid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("brand")  , updateBrand)

// delete brand
// router.delete("/brandid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("category") , isValid(deleteBrandSchema) , deleteBrand)
router.delete("/:brandid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("brand")  , deleteBrand)

// all brands
router.get('/' , allBrands)

export default router;