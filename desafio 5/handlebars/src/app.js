const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const server = app.listen(8080,()=>console.log("Escuchando en 80800"))
const ProductManager = require('./managers/ProductManager')
const ProductService = new ProductManager()

app.engine('handlebars',handlebars.engine())
app.set('views','./src/views')
app.set('view engine','handlebars')
app.use(express.json())
app.use(express.urlencoded({extended:true}))


let products= []
function getAllItems(){    
    ProductService.getAll().then(result=>products=result)
    return products
}

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/products',(req,res)=>{
    
    res.render('products',{
        products:getAllItems()
    })
})
app.post('/products',(req,res)=>{
    ProductService.add(req.body).then(res.redirect('/products')).then(res=>res.send(getAllItems()))
})
