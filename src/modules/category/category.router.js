import { Router } from 'express'
// import { isValid } from '../../middleware/validation.middleware'
import { createCategory , updateCategory , deleteCategory , allCategories } from './category.controller.js'
// import { createCategorySchema } from './category.validation.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js'
import { fileUpload, filterObject } from '../../utils/multer.js'
import  SubcategoryRouter  from '../subcategory/subcategory.router.js'
import  productRouter  from '../product/product.router.js'

// import { updateCategorySchema  , createCategorySchema , deleteCategorySchema} from './category.validation.js'
const router = Router()

// for subcategory url
router.use("/:categoryid/subcategory" , SubcategoryRouter)
// for products url
router.use("/:categoryid/products" , productRouter)

// create category
// router.post("/" , isAuthenticated, isAuthorized("admin") , fileUpload(filterObject.image).single("category") ,isValid(createCategorySchema) , createCategory)
router.post("/" , isAuthenticated, isAuthorized("admin") , fileUpload(filterObject.image).single("category")  , createCategory)

// update category
// router.patch("/categoryid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("category") , isValid(updateCategorySchema) , updateCategory)
router.patch("/:categoryid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("category")  , updateCategory)

// delete category
// router.delete("/categoryid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("category") , isValid(deleteCategorySchema) , updateCategory)
router.delete("/:categoryid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).single("category")  , deleteCategory)

// all categories
router.get('/' , allCategories)

export default router;