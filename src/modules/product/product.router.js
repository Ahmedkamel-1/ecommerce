import { Router } from 'express'
import { createProduct , updateProduct , deleteProduct , allProducts , singleProduct } from './product.controller.js'
// import { createProductSchema } from './product.validation.js'
// import { updateProductSchema  , createProductSchema , productidSchema} from './product.validation.js'
// import { isValid } from '../../middleware/validation.middleware'
import { isAuthenticated } from '../../middleware/authentication.middleware.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js'
import { fileUpload, filterObject } from '../../utils/multer.js'
const router = Router({mergeParams:true})

// create product
// router.post("/" , isAuthenticated, isAuthorized("admin") , fileUpload(filterObject.image).fields([{name: "defaultimage" , maxCount:1},{name: "subimages" , maxCount:3}]) ,isValid(createProductSchema) , createProduct)
router.post("/" , isAuthenticated, isAuthorized("admin") , fileUpload(filterObject.image).fields([{name: "defaultimage" , maxCount:1},{name: "subimages" , maxCount:3}])  , createProduct)

// update product
// router.patch("/productid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).fields([{name: "defaultimage" , maxCount:1},{name: "subimages" , maxCount:3}]) , isValid(updateProductSchema) , updateProduct)
router.patch("/:productid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).fields([{name: "defaultimage" , maxCount:1},{name: "subimages" , maxCount:3}])  , updateProduct)

// delete product
// router.delete("/productid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).fields([{name: "defaultimage" , maxCount:1},{name: "subimages" , maxCount:3}]) , isValid(productidSchema) , updateProduct)
router.delete("/:productid" , isAuthenticated , isAuthorized("admin") , fileUpload(filterObject.image).fields([{name: "defaultimage" , maxCount:1},{name: "subimages" , maxCount:3}]) , deleteProduct)

// all Products
router.get('/' , allProducts)

// read category products
router.get('/category/categoryid/product')

// single product
// router.get("/:productid" , isValid(productidSchema) , singleProduct)
router.get("/:productid" , singleProduct)

export default router;