import mongoose, { model, Types ,Schema } from "mongoose";


// schema
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 20,
    },description: String
    ,images: [ { id: {type:String , required:true} , url: {type:String , required:true }} ]
    ,defaultimage: { id: {type:String , required:true} , url: {type:String , required:true }}
    ,availableitems: {
        type:Number,
        min:1,
        required:true,
    },solditems: {
        type :Number,
        default:0
    },price: {
        type :Number,
        required:true,
    },discount: {
        type:Number,
        min:1,
        max:100
    },createdBy: {
        type: Types.ObjectId,
        ref:"User",
        required:true
    },category: {
        type:Types.ObjectId,
        ref:"Category",
        required:true
    },subcategory: {
        type:Types.ObjectId,
        ref:"Subcategory",
        required:true
    },brand: {
        type:Types.ObjectId,
        ref:"Brand",
        required:true
    }, cloudFolder: {
        type:String,
        unique:true
    }
} , { timestamps:true , strictQuery:true , toJSON: {virtuals:true}, toObject: {virtuals:true} } )


// virtual
productSchema.virtual('finalPrice').get(function(){
    // this >>> document >>>> product{}
    if(this.price) {
        return Number.parseFloat(
            this.price - (this.price * this.discount || 0) / 100
        ).toFixed(2)
    }
})

// Query Helper
productSchema.query.paginate = function async(page) {
    // pagination
    page = !page || page < 1 || isNaN() ? 1 : page
    const limit = 2
    const skip = limit * (page-1)
    return this.skip(skip).limit(limit)
}


productSchema.query.customSelect = function (fields) {
    // select
    if(!fields) return this
    // model keys
    const modelKeys = Object.keys(Product.schema.paths)
    // query keys
    const queryKeys = fields.split(" ")
    //matched Keys
    const matshedKeys = queryKeys.filter((key) => modelKeys.includes(key) )
    return this.select(matshedKeys)
}


// stock function
productSchema.methods.inStock = function (requiredQuantity) {
    // this >>> document >>> product document
    return this.availableitems >= requiredQuantity ? true : false
}


// model
export const Product = mongoose.models.Product || model("Product" , productSchema)