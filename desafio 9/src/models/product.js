import mongoose from 'mongoose'
const productCollection = 'products'


const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true  
    },
    thumbnail:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    }
})
const ProductModel = mongoose.model(productCollection,ProductSchema)

export default ProductModel