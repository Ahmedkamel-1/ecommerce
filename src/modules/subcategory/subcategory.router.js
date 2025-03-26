import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
// import { isValid } from "../../middleware/validation.middleware.js";
// import { createSubCategorySchema , updateSubCategorySchema , deleteSubCategorySchema } from './subcategory.validation.js'
import { fileUpload, filterObject } from "../../utils/multer.js";
import { createSubcategory , updateSubcategory , deleteSubcategory , allSubcategories } from "./subcategory.controller.js";
const router = Router({ mergeParams:true })

// CRUD
// create
// router.post("/" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("subcategory") , isValid(createSubCategorySchema) , createSubcategory)
router.post("/" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("subcategory") , createSubcategory)

// update
// router.patch("/:categoryid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("subcategory") , isValid(updateSubCategorySchema) , updateSubcategory)
router.patch("/:subcategoryid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("subcategory") , updateSubcategory)

// delete
// router.delete("/:categoryid" , isAuthenticated , isAuthorized("admin") , isValid(deleteSubCategorySchema) , deleteSubcategory)
router.delete("/:subcategoryid" , isAuthenticated , isAuthorized("admin") , deleteSubcategory)

// all subCategories
// router.get("/" , allSubcategories)
router.get("/" , allSubcategories)

export default router;