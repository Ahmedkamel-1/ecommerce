import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Product } from "../../../DB/models/product.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { Brand } from "../../../DB/models/brand.model.js";


// create product
export const createProduct = asyncHandler(async (req,res,next) => {
    // data
    // const { name, description , price, discount , availableitems , category , subcategory ,brand } = req.body
    // check category
    const category = await Category.findById(req.body.category)
    if(!category) return next(new Error("category not found!"))
    if(!req.files) return next(new Error("Product images are required!" , {cause:400}))
    // check subcategory
    const subcategory = await Subcategory.findById(req.body.subcategory)
    if(!subcategory) return next(new Error("Subcategory not found!"))
    // check brand
    const brand = await Brand.findById(req.body.brand)
    if(!brand) return next(new Error("Brand not found!"))
    // files
    if(!req.files) return next(new Error("Product images are required!" , {cause:400}))
    // create unique folder name
    const cloudFolder = nanoid()
    let images = []
    // upload sub files
    for (const file of req.files.subimages) {
        const { secure_url , public_id} = await cloudinary.uploader.upload(
        file.path,
        {
            folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}`
        })
        images.push({id:public_id , url:secure_url})
    }
    // upload main image
    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.files.defaultimage[0].path,
        { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}`
    })
    // create product
    const product = await Product.create({
        ...req.body,
        cloudFolder,
        createdBy: req.user._id,
        defaultimage: { url:secure_url , id:public_id },
        images,
    })
    console.log('product1 w discount: ' , product.finalPrice)
    // send response
    return res.json({success:true , message:"Product created successfully!" , results:product})
})

// update product
export const updateProduct = asyncHandler(async (req,res,next) => {

})

// delete product
export const deleteProduct = asyncHandler(async (req,res,next) => {
    // check product
    const product = await Product.findById(req.params.productid)
    if(!product) return next(new Error("Product not found!"))
    // check owner
    if(req.user._id.toString() != product.createdBy.toString()) {
        return next(new Error("You aren't authorized!", { cause:401 }))
    }
    // delete product images
    const imagesArr = product.images
    const ids = imagesArr.map((imageObj) => imageObj.id)
    ids.push(product.defaultimage.id) // add id of default image 
    const result = await cloudinary.api.delete_resources(ids)
    // delete folder
    await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`)
    // delete product
    await Product.findByIdAndDelete(req.params.productid)
    // send respone
    return res.json({success:true , message:"Product deleted successfully!"})
})

// allproducts
export const allProducts = asyncHandler(async (req,res,next) => {
    // data search  in req.query
    // const products = await Product.find({ name:{$regex:req.query.name} })
    // const products = await Product.find({})

    // pagination
    // let { page } = req.query
    // page = !page || page < 1 || isNaN() ? 1 : page
    // console.log("page :",page)
    // const limit = 2
    // const skip = limit * (page-1)
    // console.log("skip :",skip)
    // const products = await Product.find({}).skip(skip).limit(limit)

    // select
    // const { fields } = req.query
    // const products = await Product.find().select(fields)
    // model keys
    // const modelKeys = Object.keys(Product.schema.paths)
    // console.log("modelkeys : " , modelKeys)
    //query keys
    // const queryKeys = fields.split(" ")
    // console.log("queryKeys :" , queryKeys)
    //matched Keys
    // const matshedKeys = queryKeys.filter((key) => modelKeys.includes(key) )
    // console.log("matchedKeys :" , matshedKeys)
    // const product = await Product.find().select(matshedKeys)
    /************** search ************/
    // const { keyword } = req.query
    // let products = await Product.find({
    //     $or: [{name:{$regex:keyword , $options:"i"}}
    //         , {description: {$regex:keyword , $options:"i"}}],
    // })
    /************** filter ************/
    // const { name, price } = req.query
    // const products = await Product.find({...req.query})

    /************** sort *************/
    //const { sort } = req.query
    // console.log("sort :" , sort)
    // const products = await Product.find().sort(sort)

    if(req.params.categoryid) {
        const category =  await Category.findById(req.params.categoryid)
        if(!category) return next(new Error("Category not found!"))
        const products = await Product.find({category:req.params.categoryid})
        return res.json({success:true , results:products})
    }
    const products = await Product.find({...req.query})
    .paginate(req.query.page)
    .customSelect(req.query.fields)
    .sort(req.query.sort)
    return res.json({success:true , results:products})
})

// single product
export const singleProduct = asyncHandler(async (req,res,next) => {
    const product = await Product.findById(req.params.productid)
    if(!product) return next(new Error("Product not found!"))
    return res.json({success:true , results: product})
})