import express from "express"
import dotenv from "dotenv"
import apiRandoms from "./routes/randoms.js"
import cluster from "cluster"
import os from "os"
import compression from "compression"
import log4js from "log4js"

const app = express();
dotenv.config()
let PORT = process.argv[2]   // INGRESAR EL PUERTO COMO 1ER VALOR VÍA COMANDO
const method = process.argv[3] // INGRESAR EL METODO, YA SEA FORK O CLUSTER COMO 2DO VALOR VÍA COMANDO
app.use(compression())

log4js.configure({
    appenders:{
        myLoggerConsole:{type:"console"},
        myLoggerWarnFile:{type:"file",filename:"warn.log"},
        myLoggerErrorFile:{type:"file",filename:"error.log"}
    },
    categories:{
        default:{appenders:["myLoggerConsole"],level:"info"},
        warning:{appenders:["myLoggerConsole","myLoggerWarnFile"],level:"warn"},
        error:{appenders:["myLoggerConsole","myLoggerErrorFile"],level:"error"}
    }
})

app.use('/favicon.ico', (req, res) => res.status(204)); // hago esto porque sino me salta como una ruta solicitada con el logger info y warn

const loggerInfo = log4js.getLogger("default")
const loggerWarn = log4js.getLogger("warning")
const loggerError = log4js.getLogger("error") // no lo implemento porque en este desafío no tengo ni apis de mensajes, ni de productos

app.use(function (req, res, next) {
    loggerInfo.info(`ruta ${req.originalUrl} solicitada con el método ${req.method}`)
    next();
})
let processInfo = {
    "INSERTED_ARGUMENTS": process.argv.slice(2),
    "EXECUTION_PATH":process.execPath,
    "SYSTEM": process.platform,
    "PROCESS_ID":process.pid,
    "NODE_VERSION":process.version,
    "APP_PATH":process.cwd(),
    "MEMORY_USED":process.memoryUsage().rss + " rss"

}
if(method!=undefined){
    if(method.toLowerCase()=="cluster"){
        const totalCPUs = os.cpus().length
        if(cluster.isPrimary){
            for(let i=0; i<totalCPUs;i++){
                cluster.fork()
            }
            cluster.on("exit",(worker, code, signal)=>{
                console.log(`the ${worker.process.pid} process stopped working`)
                cluster.fork()
            })
        }
        else{
            if(isNaN(PORT)){
                const server = app.listen(8080,()=>console.log(`running process ${process.pid} listening on default port (8080)`))
            }else{
                const server = app.listen(PORT,()=>console.log(`running process ${process.pid} listening on ${PORT}`))
            }   
        }
        app.get("/info",(req,res)=>{
            processInfo.TOTAL_CPUs = totalCPUs
            res.send(processInfo)
        })
        app.get("/",(req,res)=>{
            res.send(`escuchando en el puerto ${PORT} con el proceso ${process.pid} en el método ${method}`)
        })
    }else{
        if(isNaN(PORT)){
            const server = app.listen(8080,()=>console.log(`running process ${process.pid} listening on default port (8080)`))
        }else{
            const server = app.listen(PORT,()=>console.log(`running process ${process.pid} listening on ${PORT}`))
        }
        app.get("/info",(req,res)=>{
            res.send(processInfo)
        })
        app.get("/",(req,res)=>{
            res.send(`escuchando en el puerto ${PORT} con el proceso ${process.pid}`)
        })
    }
}
else{
    if(isNaN(PORT)){
        const server = app.listen(8080,()=>console.log(`running process ${process.pid} listening on default port (8080)`))
    }else{
        const server = app.listen(PORT,()=>console.log(`running process ${process.pid} listening on ${PORT}`))
    }
    app.get("/info",(req,res)=>{    
        res.send(processInfo)
    })
    app.get("/",(req,res)=>{
        res.send(`escuchando en el puerto ${PORT} con el proceso ${process.pid}`)
    })
}
app.get("/loggererror",(req,res)=>{
    loggerError.error("ejemplo de como funcionaría el error")
    res.send("logger error enviado")
})
//app.use(apiRandoms)
app.use('*', function(req, res){
    loggerWarn.warn(`ruta ${req.originalUrl} solicitada con el método ${req.method} no implementado`)
    res.send({status:"error", description:`ruta ${req.originalUrl} método ${req.method} no implementada`});
    }
)