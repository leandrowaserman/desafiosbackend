const express = require('express')
const productRouter = require('./routes/Products')

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/products',productRouter)
app.use(express.static(__dirname+'/public'))
const server = app.listen(8080, ()=>console.log("Listening on port 8080"))