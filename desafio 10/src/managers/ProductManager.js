import ProductModel from "../models/product.js"
class ProductManager{

    add = async(product) => {
        await ProductModel.create(product)
        return{status:"success", message:"New Product Created"}
    }
    getById = async(id) =>{
        if(!id) return{status:"error", error:"Id needed"}
        let search = await ProductModel.find({_id:id})
        if(search) return(search)
        return{status:"error", error:"product not found"}
    }
    getAll = async () =>{
        return await ProductModel.find()
    }
    update = async(id, newProd)=>{
        if(!id || !newProd) return{status:"error", error:"data missing"}
        let exist = await ProductModel.find({_id:id})
        if(!exist) return{status:"error", error:"product not found"}
        if (newProd.name){
            await ProductModel.updateOne({_id:id}, {$set:{name:newProd.name}})
        }
        if(newProd.thumbnail){
            await ProductModel.updateOne({_id:id}, {$set:{thumbnail:newProd.thumbnail}})
        }
        if(newProd.price){
            await ProductModel.updateOne({_id:id}, {$set:{price:newProd.price}})
        }
        return{status:"success", message:"Product Updated"}
    }
    deleteById = async(id) =>{
        if(!id) return{status:"error", error:"Id needed"}
        let products = await ProductModel.find()
        if (products.length===0)return{status:"error", error:"There are no Products"}
        await ProductModel.deleteOne({_id:id})
        return{status:"success",message:"Product Deleted"}
    }
    deleteAll = async() =>{
        let products = await ProductModel.find()
        if (products.length===0) return{status:"error", error:"There are no Products"}
        await ProductModel.deleteMany()
        return{status:"success",message:"All Products Deleted"}
    }
}
export default ProductManager


