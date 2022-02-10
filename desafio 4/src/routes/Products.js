const express = require('express')
const router = express.Router()
const ProductManager = require('../managers/ProductManager')
const uploader = require('../services/upload')
const ProductService = new ProductManager()

router.get('/', (req, res)=>{
    ProductService.getAll().then(result=>res.send(result))
})
router.get('/:id', (req,res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    ProductService.getById(id).then(result=>res.send(result))
})
router.post('/',uploader.single('file'),(req,res)=>{
    let product = req.body
    let file = req.file
    if(!file) return res.status(500).send({error:"No se pudo subir el archivo"})
    product.thumbnail=req.protocol+"://"+req.hostname+":8080/img/"+file.filename
    ProductService.add(product).then(result=>res.send(result))
})
router.put('/:id',uploader.single('file'),(req,res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    let product = req.body
    let file = req.file
    if(!file) return res.status(500).send({error:"No se pudo subir el archivo"})
    product.thumbnail=req.protocol+"://"+req.hostname+":8080/img/"+file.filename
    ProductService.overwrite(product, id).then(result=>res.send(result))
})
router.delete('/:id', (req, res)=>{
    let param = req.params.id
    if(isNaN(param))return(res.status(400).send({error:"No es un numero"}))
    let id = parseInt(param)
    ProductService.deleteById(id).then(result=>res.send(result))
})

module.exports= router 