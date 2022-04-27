import express from 'express'
import {Server} from 'socket.io'
import ProductManager from './managers/ProductManager.js'
import ChatManager from './managers/ChatManager.js'
import path from 'path';
import {fileURLToPath} from 'url';
import connection from './config/config.js';
import UserManager from './managers/UserManager.js';
import faker from "faker"
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import { UserModel } from './models/chat.js';
import cookieParser from 'cookie-parser'

const LocalStrategy = passportLocal.Strategy

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


//config
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//cookies
app.use(session({
    store:MongoStore.create({
        mongoUrl:'mongodb+srv://leandro:coderMongo123@clustercoderdesafio.x9swe.mongodb.net/ecommerce?retryWrites=true&w=majority',
        ttl:600
    }),
    secret:"s8fyas9fyasfhaisr89",
    resave:true,
    saveUninitialized:false, 
}))
app.use(passport.initialize())
app.use(passport.session())

//bcrypt
const createHash = (password)=>{
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10)
    )
}


// passport
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
   done(null, user);
});

passport.use('login', new LocalStrategy(
    {
        passReqToCallback: true
    },
    async function(req, username, password, done){

        UserModel.findOne({username:username},(err,userFound)=>{
            if(err) return done(err);
            if(!userFound) return done(null, false, {message:"user does not exists"})
            if(!bcrypt.compareSync(password, userFound.password)){
                return done(null, false,{message:"password does not match"})
            }
            req.session.user = userFound
            done(null, userFound);
        })
    }
))

passport.use('register', new LocalStrategy(
    {
        passReqToCallback:true
    },
    (req,username,password,done)=>{
        UserModel.findOne({mail:req.body.mail},(err,user)=>{
            if(err) return done(err)
            if(user) return done(null, false, {message:"user already exists"});
            const newUser = {
                mail:req.body.mail,
                name: req.body.name,
                last_name:req.body.last_name,
                age:req.body.age,
                username: username,
                avatar:req.body.avatar,
                password: createHash(password)
            }
            UserModel.create(newUser, (err,userCreated)=>{
                if(err) return done(err);
                return done(null,userCreated)
            })
        })
    }
))


//INDEX
app.get('/',(req,res)=>{
    if(!req.session.user) res.sendFile(path.join(process.cwd(), 'src/public/index.html'))
    res.sendFile(path.join(process.cwd(), 'src/public/loggedIndex.html'))
})


//REGISTER
app.get('/register',(req,res)=>{
    const user = req.session?.user
    if (user) {
        res.send(`${user.name}, no te puedes registar estando logueado.`)
    } else {
        res.sendFile(path.join(process.cwd(), 'src/public/views/register.html'))
    }
})
app.get('/fakeregister', (req, res) =>{
    res.send(`<a href="http://localhost:8080/register">volver</a> <p>Error en el Registro</p>`)
})
app.post('/registerForm',passport.authenticate('register',{
    failureRedirect:'/fakeregister'
}), (req,res)=>{
    res.redirect('/login')
})


// LOGIN
app.get('/login', (req, res) => {
    const user = req.session?.user
    if (user) {
        let name = user.username
        res.send(`<a href="http://localhost:8080/">inicio</a> <a href="http://localhost:8080/logout">logout</a><p>bienvenido, ${name}</p>`)
    } else {
        res.sendFile(path.join(process.cwd(), 'src/public/views/login.html'))
    }
})
app.get('/fakelogin', (req, res) =>{
    res.send(`<a href="http://localhost:8080/login">volver</a> <p>Error Login</p>`)
})
app.post("/loginForm", passport.authenticate('login',{
    failureRedirect:'/fakelogin'
}), (req,res)=>{
    res.redirect('/')
})



app.get('/logout', function(req, res) {
    const user = req.session?.user
    if (user) {
        let name = user.username
        req.session.destroy(err => {
            if (err) { 
                res.redirect('/')
                
            } else {
               res.send(`<a href="http://localhost:8080/">inicio</a> <a href="http://localhost:8080/login">login</a><p>${name}, te has desconectado.</p>`) 
            }
        })
    } else {
        res.redirect('/')
    }

})


// faker
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


app.get('/afuhgaisufbvasfa',(req,res)=>{
    if(req.session.user) res.send(req.session.user)
    else res.send("no user found")
})
//socket
io.on('connection',async socket=>{

    let products = await ProductService.getAll()
    io.emit('productLog',products)
    let messages = await ChatService.getAll()
    io.emit('chatLog',messages)
    io.emit('userCheck')
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