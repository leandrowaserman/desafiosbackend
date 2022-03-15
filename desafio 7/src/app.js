import express from 'express'
import {Server} from 'socket.io'
import ProductManager from './managers/ProductManager.js'
import ChatManager from './managers/ChatManager.js'
import knex from 'knex'
import options from './options/mysqlconfig.js'
import sqlOptions from './options/mysqliteconfig.js'
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const database = knex(options);
const liteDatabase = knex(sqlOptions);

const app = express();
const server = app.listen(8080,()=>console.log(`Listening on 8080`))
const io = new Server(server);
app.use(express.static(__dirname+'/public'))
const ProductService = new ProductManager()
const ChatService = new ChatManager()



let createProducts = async() => {
    let exist = await database.schema.hasTable('products')
    if(!exist){
        await database.schema.createTable('products', table=>{
            table.increments('id')
            table.string('name',20).nullable(false)
            table.integer('price').nullable(false)
            table.string('thumbnail').nullable(false)
        })
        .then(()=>console.log("table created"))
        .catch((err)=>console.log(err))
        .finally(()=>database.destroy())
    }
} 
let createHistory = async() =>{
    let exist = await liteDatabase.schema.hasTable('history')
    if(!exist){
        await liteDatabase.schema.createTable('history', table=>{
            table.increments('id')
            table.string('user',20).nullable(false)
            table.string('info').nullable(false)
            table.string('date',10).nullable(false)
            table.string('time',8).nullable(false)
        })
        .then(()=>console.log("table created"))
        .catch((err)=>console.log(err))
        .finally(()=>database.destroy())
    }
}


io.on('connection',async socket=>{
    console.log("Nuevo Usuario conectado")
    await createProducts()
    let products = await ProductService.getAll()
    io.emit('productLog',products)
    await createHistory()
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