const express = require('express');
const {Server} = require('socket.io');
const ProductManager = require('./managers/ProductManager.js');
const ChatManager = require('./managers/ChatManager')


const app = express();
const server = app.listen(8080,()=>console.log(`Listening on 8080`))
const io = new Server(server);
app.use(express.static(__dirname+'/public'))
const ProductService = new ProductManager()
const ChatService = new ChatManager()

io.on('connection',async socket=>{
    console.log("Nuevo Usuario conectado")
    let products = await ProductService.getAll()
    io.emit('productLog',products)
    let messages = await ChatService.getAll()
    io.emit('chatLog',messages)
    socket.on('sendProduct',async data=>{
        await ProductService.add(data)
        let products = await ProductService.getAll()
        io.emit('productLog',products)
    })
    socket.on('message',async data=>{
        console.log(data)
        await ChatService.add(data)
        let messages = await ChatService.getAll()
        io.emit('chatLog',messages)        
    })
})