import express from "express"
import dotenv from "dotenv"
import apiRandoms from "./routes/randoms.js"

dotenv.config()



const app = express();

let PORT = process.argv[2]
// USAR "node app.js -p (puerto)" PARA ELEGIR EL PUERTO CORRECTAMENTE
if(isNaN(PORT)){
    const server = app.listen(8080,()=>console.log(`Listening on 8080`))
}else{
    const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
}

console.log(`puerto = ${PORT}`)
console.log(`insertado = ${process.argv}`)


app.get("/",(req,res)=>{
    res.send(`escuchando en el puerto ${PORT} con el proceso ${process.pid}`)
})
app.use(apiRandoms)
app.get("/info",(req,res)=>{
    let processInfo = {
        "INSERTED_ARGUMENTS": process.argv.slice(2),
        "EXECUTION_PATH":process.execPath,
        "SYSTEM": process.platform,
        "PROCESS_ID":process.pid,
        "NODE_VERSION":process.version,
        "APP_PATH":process.cwd(),
        "MEMORY_USED":process.memoryUsage().rss + " rss"
    
    }
    res.send(processInfo)
})