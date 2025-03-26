import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";

// create category
export const createCategory = asyncHandler(async (req,res,next)=>{
    // file
    if(!req.file) return next(new Error("Category image is required!"))
    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {folder : `${process.env.FOLDER_CLOUD_NAME}/category/`}
    )
    // save category in database
    const category = await Category.create({
        name: req.body.name,
        createdBy: req.user._id,
        image : {id: public_id , url: secure_url},
        slug: slugify(req.body.name)
    })
    // send response
    res.json({success:true , results:category})
})


// update category
export const updateCategory = asyncHandler(async (req,res,next)=>{
    // check category
    const category = await Category.findById(req.params.categoryid)
    if(!category) return next(new Error("Category not found!"))
    // check owner
    if(req.user._id.toString() !== category.createdBy.toString()) {
        return next(new Error("You are not Authorized!"))
    }
    // name
    category.name = req.body.name ? req.body.name : category.name
    // slug
    category.slug = req.body.name ? slugify(req.body.name) : category.slug
    if(req.file) {
    const { public_id , secure_url } = await cloudinary.uploader.upload(
        req.file.path, {
            public_id: category.image.id,
        }
    )
        category.image.url = secure_url 
    }
    // save category
    await category.save()
    return res.json({success:true , message:"category updated successfully"})
})


// delete category
export const deleteCategory = asyncHandler(async (req,res,next)=>{
    // check category
    const category = await Category.findById(req.params.categoryid)
    if(!category) return next(new Error("Category not Found!"))
    // check owner
    if(req.user._id.toString() !== category.createdBy.toString()) {
        return next(new Error("You are not Authorized!"))
    }
    // delete image
    const result = await cloudinary.uploader.destroy(category.image.id)
    // delete category
    // await category.remove()
    await Category.findByIdAndDelete(req.params.categoryid)
    // delete subcategories
    await Subcategory.deleteMany({ categoryid: category.id })
    // response
    return res.json({success:true , message:"category deleted successfully"})
})


// all categories
export const allCategories = asyncHandler(async (req,res,next)=>{
    const categories = await Category.find().populate({
        path:'subcategory',
        populate: [{path:"createdBy" , select:"userName -_id"}]
    })
    return res.json({success:true , result:categories})
})