import options from '../options/mysqlconfig.js'
import knex from 'knex'
const database = knex(options)


class ProductManager{

    add = async(product) => {
        if(!product.name || !product.price || !product.thumbnail){
            return{status:"error", error:"faltan completar datos"}
        }
        try{
            await database('products').insert(product)
            .then(()=>{return{status:"success", message: "product created"}})
            .catch(console.log)
        }
        catch(error){
            return{status:"error", message:error}
        }
    }
    overwrite = async(product, id)=>{
        let exist = await database.schema.hasTable('products')
        if(exist){
            let checkproduct = database.from('products').select('*').where('id',id)
            if(checkproduct){
                database.from('products').where('id',id).update(product)
                .then(()=>{return{status:"success", message: "product updated"}})
                .catch(console.log)
            }
            else{
                return{status:"error", error:"Product not found"}
            }
        }   
    }
    getById = async(id)=>{
        let exist = await database.schema.hasTable('products')
        if(exist){
            let product = database.from('products').select('*').where('id',id)
            if(product){
                let data = database.from('products').select('*').where('id',id)
                return(data)
            }
            else{
                return{status:"error", error:"Product not found"}
            }
        }
    }
    getAll = async () =>{
        let data = database.from('products').select('*')
        return(data)

    }
    deleteById = async (id) =>{
        if(!id){
            return{status:"error", error:"Id needed"}
        }
        let exist = await database.schema.hasTable('products')
        if(exist){
            let product = database.from('products').select('*').where('id',id)
            if(product){
                database.from('products').where('id',id).del()
                .then(()=>{return{status:"success", message: "product deleted"}})
                .catch(console.log)
            }
            else{
                return{status:"error", error:"Product not found"}
            }
        }   
    }
    deleteAll = async () =>{
        let exist = await database.schema.hasTable('products')
        if(exist){
            database.from('products').del()
            .then(()=>{return{status:"success", message: "products deleted"}})
            .catch(console.log)
        }  
    }
}
export default ProductManager


