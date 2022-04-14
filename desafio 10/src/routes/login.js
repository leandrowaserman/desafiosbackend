import { Router } from 'express'
import path from 'path'
import UserManager from '../managers/UserManager.js'
const UserService = new UserManager()
const LoginRouter = new Router()



LoginRouter.get('/login', (req, res) => {
    const user = req.session?.user
    if (user) {
        res.send(`Bienvenido ${user.name}`)
    } else {
        res.sendFile(path.join(process.cwd(), 'src/public/views/login.html'))
    }
})
LoginRouter.post('/login',async (req,res)=>{
    let mail = req.body.mail    
    let initialUser = await UserService.getByMail(mail)
    if(initialUser.error || !initialUser.length) return (console.log("User not found"))
    let user = initialUser[0]
    req.session.user = user
    res.send(`Bienvenido ${req.session.user.name}`)
})

export default LoginRouter