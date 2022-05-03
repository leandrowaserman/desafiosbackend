import minimist from "minimist"
import express from "express"
import dotenv from "dotenv"
import apiRandoms from "./routes/randoms.js"

dotenv.config()

const options = {alias:{p:"PORT"}}

const objArguments = minimist(process.argv.slice(2),options)

let PORT = objArguments.PORT

const app = express();
// USAR "node app.js -p (puerto)" PARA ELEGIR EL PUERTO CORRECTAMENTE
if(isNaN(PORT)){
    const server = app.listen(8080,()=>console.log(`Listening on 8080`))
}else{
    const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
}


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