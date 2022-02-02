const fs = require('fs')
const express = require('express');
const app = express();
const pathToData = './data.json'
const server = app.listen(8080,()=>{
    console.log("Listening on port 8080");
})


class Container{
    save = async(product) => {
        if(!product.name || !product.category || !product.price){
            return{status:"error", error:"faltan completar datos"}
        }
        try{
            if(fs.existsSync(pathToData)){
                let data = await fs.promises.readFile(pathToData,'utf-8')
                let products = JSON.parse(data)
                if(products.length===0){
                    let newProduct = Object.assign({id:1},product)
                    await fs.promises.writeFile(pathToData, JSON.stringify([newProduct], null, 2)) 
                    return{status:"success", message:"New Product Created", id:1}
                }else{
                    let newId = products[products.length-1].id+1
                    product.id = newId
                    products.push(product)
                    await fs.promises.writeFile(pathToData, JSON.stringify(products,null,2))
                    return{status:"success", message:"New Product Created", id:newId} 
                }
            }else{
                let newProduct = Object.assign({id:1},product)
                await fs.promises.writeFile(pathToData, JSON.stringify([newProduct], null, 2)) 
                return{status:"success", message:"New Product Created", id:1}
            }
        }
        catch(error){
            return{status:"error", message:error}
        }
    }
    getById = async(id)=>{
        if(fs.existsSync(pathToData)){
            let data = await fs.promises.readFile(pathToData,'utf-8')
            let products = JSON.parse(data)
            let product = products.find(u => u.id === id)
            if(product){
                return{status:"success",info:product}
            }
            else{
                return{status:"error", error:"Product not found"}
            }
        }
    }
    getAll = async () =>{
        if(fs.existsSync(pathToData)){
            let data = await fs.promises.readFile(pathToData,'utf-8')
            let products = JSON.parse(data)
            return{status:"success",info:products}
        }
    }
    deleteById = async (id) =>{
        if(!id){
            return{status:"error", error:"Id needed"}
        }
        if(fs.existsSync(pathToData)){
            let data = await fs.promises.readFile(pathToData,'utf-8')
            let products = JSON.parse(data)
            let newProducts = products.filter(u => u.id !== id)
            await fs.promises.writeFile(pathToData,JSON.stringify(newProducts,null,2))
            return{status:"success",message:"Product Deleted"}
        }
    }
    deleteAll = async () =>{
        if(fs.existsSync(pathToData)){
            let data = await fs.promises.readFile(pathToData,'utf-8')
            let products = JSON.parse(data)
            if(products==''){
                return{status:"error", error:"There are no Products"}
            }else{
                await fs.promises.writeFile(pathToData,'')
                return{status:"success",message:"All Products Deleted"}
            }
        }else{
            return{status:"error", error:"The file doesnt exist"}
        }
        
    }
}

app.get('/', (request,response) =>{
    response.send("Hola! Agregue /products para obtener la lista de los productos o /randomProduct para obtener un producto random")
})
app.get('/products', async (request,response) =>{
    let data = await fs.promises.readFile(pathToData,'utf-8')
    let products = JSON.parse(data)
    response.send(products)
})
app.get('/randomProduct', async (request,response) =>{
    let data = await fs.promises.readFile(pathToData,'utf-8')
    let products = JSON.parse(data)
    let lastId=products.length
    let searchId= Math.floor(Math.random()*lastId+1)
    let product = products.find(u => u.id === searchId)
    response.send(product)
})

module.exports = Container