import Container from "../models/products.models.js";

let productDaos = new Container()

const getAll = async() =>{
    return await productDaos.getAll()
}
const getById = async(id)=>{
    return await productDaos.getById(id)
}
const addProduct = async(product)=>{
    return await productDaos.add(product)
}
const overwrite = async(product, id)=>{
    return await productDaos.overwrite(product,id)
}
const deleteById = async(id)=>{
    return await productDaos.deleteById(id)
}
const deleteAll = async()=>{
    return await productDaos.deleteAll()
}
export{
    getAll,
    getById,
    addProduct,
    overwrite,
    deleteById,
    deleteAll
}