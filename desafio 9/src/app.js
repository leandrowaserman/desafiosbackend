import express from 'express'
import {Server} from 'socket.io'
import ProductManager from './managers/ProductManager.js'
import ChatManager from './managers/ChatManager.js'
import path from 'path';
import {fileURLToPath} from 'url';
import connection from './config/config.js';
import UserManager from './managers/UserManager.js';
import faker from "faker"
import { denormalize,schema } from 'normalizr';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ProductService = new ProductManager()
const ChatService = new ChatManager()
const UserService = new UserManager()
const {commerce,image} = faker
const author = new schema.Entity('author')
const messageSchema = ('messages',{
    author:author
})


const app = express();
const server = app.listen(8080,()=>console.log(`Listening on 8080`))
const io = new Server(server);
app.use(express.static(__dirname+'/public'))

connection()


app.use('/api/products-test', function (req, res){
    let productsTest = []
    for(let i=0;i<5;i++){
        productsTest.push({
            product: commerce.product(),
            name: commerce.productName(),
            price: commerce.price(),
            thumbnail: image.image()
        })
    }
    res.send(productsTest)
})



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
    socket.on('message',async (message, userMail)=>{
        let user = await UserService.getByMail(userMail)
        console.log(user[0])
        if(user.error || !user.length) return (console.log("User Not Found"))
        await ChatService.add(message, user[0])
        let messages = await ChatService.getAll()
        io.emit('chatLog',messages)        
    })
    socket.on("sendUser", async (data)=>{
        console.log(data)
        await UserService.add(data)
    })
})