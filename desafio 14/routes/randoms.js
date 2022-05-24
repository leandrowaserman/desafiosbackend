import { Router } from 'express'
import { fork }  from 'child_process'


const apiRandoms = new Router()
const child = fork("./routes/randomchild.js")

apiRandoms.get("/api/randoms", (req,res)=>{
    let param = req.query.cant  
    if(isNaN(param)) child.send("no es un numero")
    else child.send(param)
    
    child.on("message",childMsg=>{
        res.send(`${childMsg}`)
    })
})

export default apiRandoms