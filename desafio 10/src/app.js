import express from 'express'
import {Server} from 'socket.io'
import ProductManager from './managers/ProductManager.js'
import ChatManager from './managers/ChatManager.js'
import path from 'path';
import {fileURLToPath} from 'url';
import connection from './config/config.js';
import UserManager from './managers/UserManager.js';
import faker from "faker"
// import LoginRouter from './routes/login.js';
import session from 'express-session'
import MongoStore from 'connect-mongo'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ProductService = new ProductManager()
const ChatService = new ChatManager()
const UserService = new UserManager()
const {commerce,image} = faker



const app = express();
const server = app.listen(8080,()=>console.log(`Listening on 8080`))
const io = new Server(server);
app.use(express.static(__dirname+'/public'))


connection()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(session({
    store:MongoStore.create({
        mongoUrl:'mongodb+srv://leandro:coderMongo123@clustercoderdesafio.x9swe.mongodb.net/ecommerce?retryWrites=true&w=majority',
        ttl:3600
    }),
    secret:"s8fyas9fyasfhaisr89",
    resave:true,
    saveUninitialized:false, 
}))
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
// login
app.get('/login', (req, res) => {
    const user = req.session?.user
    if (user) {
        res.send(`Bienvenido ${user.name}`)
    } else {
        res.sendFile(path.join(process.cwd(), 'src/public/views/login.html'))
    }
})
app.post('/login',async (req,res)=>{
    let mail = req.body.mail    
    let initialUser = await UserService.getByMail(mail)
    if(initialUser.error || !initialUser.length) return (console.log("User not found"))
    let user = initialUser[0]
    req.session.user = user
    res.send(`Bienvenido ${req.session.user.name}`)
})
app.get('/logout', function(req, res) {
    const user = req.session?.user.name
    if (user) {
        req.session.destroy(err => {
            if (err) { 
                res.redirect('/login')
                
            } else {
                res.send(`${user}, te has desconectado`)
            }
        })
    } else {
        res.redirect('/login')
    }

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
    // socket.on('message',async (message)=>{
    //     console.log(user)
    //     await ChatService.add(message, user)
    //     let messages = await ChatService.getAll()
    //     io.emit('chatLog',messages)    
    // })
    socket.on('message',async (message)=>{
        socket.on('userCookie', async(author)=>{
            if(!author.length || !author) return(window.location('/login'))
            await ChatService.add(message, author)
            let messages = await ChatService.getAll()
            io.emit('chatLog',messages)        
        })

    })
    socket.on("sendUser", async (data)=>{
        console.log(data)
        await UserService.add(data)
    })

})