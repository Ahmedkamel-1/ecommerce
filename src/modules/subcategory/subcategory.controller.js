import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";


// create subcategory
export const createSubcategory = asyncHandler(async (req,res,next) => {
    // categoryid
    const { categoryid } = req.params
    // check file
    if(!req.file) return next(new Error("image is required!" , {cause:400}))
    // check categgory
    const category = await Category.findById(categoryid)
    if(!category) return next(new Error("Category not Found!" , {cause:400}))
    // upload file
    const { public_id , secure_url} = await cloudinary.uploader.upload(
    req.file.path,
    {
        folder: `${process.env.FOLDER_CLOUD_NAME}/subcategory`
    }
    )
    // save in database
    const subcategory = await Subcategory.create({
        name: req.body.name,
        slug : slugify(req.body.name),
        createdBy : req.user._id,
        image: {id: public_id , url: secure_url},
        categoryid
    });
    return res.json({success:true , results:subcategory ,message:"Subcategory created successfully!"})
})

// update subcategory
export const updateSubcategory = asyncHandler(async (req,res,next) => {
    // check category
    const category = await Category.findById(req.params.categoryid)
    if(!category) return next(new Error("Category not found!" , {cause:400}))
    // check subcategory
    const subcategory = await Subcategory.findById({_id:req.params.subcategoryid , categoryid:req.params.categoryid})
    if(!subcategory) return next(new Error("subcategory not found!" , {cause:400}))
    // check owner
    if(req.user._id.toString() !== subcategory.createdBy.toString()) {
        return next(new Error("You are not Authorized!"))
    }
    subcategory.name = req.body.name ? req.body.name : subcategory.name
    subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug
    // file
    if(req.file) {
        const {secure_url} = await cloudinary.uploader.upload(
            req.file.path,
            {public_id: subcategory.image.id}
        )
        subcategory.image.url = secure_url
    }
    // save
    await subcategory.save()
    // return
    return res.json({success:true , results:subcategory , message:"Subcategory updated successfully!"})
})

// delete subcategory
export const deleteSubcategory = asyncHandler(async (req,res,next) => {
    // check category
    const category = await Category.findById(req.params.categoryid)
    if(!category) return next(new Error("Category not found!" , {cause:400}))
    // check subcategory and delete
    const subcategory = await Subcategory.findOneAndDelete({_id:req.params.subcategoryid , categoryid:req.params.categoryid})
    if(!subcategory) return next(new Error("subcategory not found!" , {cause:400}))
    // check owner
    if(req.user._id.toString() !== subcategory.createdBy.toString()) {
        return next(new Error("You are not Authorized!"))
    }
    // delete image
    const result = await cloudinary.uploader.destroy(subcategory.image.id)
    // return
    return res.json({success:true , message:"Subcategory deleted successfully!"})
})

// all subcategories
export const allSubcategories = asyncHandler(async (req,res,next) => {
    const subcategories = await Subcategory.find().populate([
        {
            path: "categoryid",
            select: "name"
        },
        {
            path: "createdBy"
        }
    ])
    return res.json({ success:true , results:subcategories })
})