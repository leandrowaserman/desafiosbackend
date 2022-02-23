const fs = require('fs')
const pathToHistory = 'src/data/history.json'

class Container {
    add = async(message) => {
        if(!message.user || !message.info || !message.date || !message.time){
            return{status:"error", error:"faltan completar datos"}
        }
        try{
            if(fs.existsSync(pathToHistory)){
                let data = await fs.promises.readFile(pathToHistory,'utf-8')
                let messages = JSON.parse(data)
                if(messages.length===0){
                    let newMessage = Object.assign({id:1},message)
                    await fs.promises.writeFile(pathToHistory, JSON.stringify([newMessage], null, 2)) 
                    return{status:"success", message:"New Message Sent"}
                }else{
                    let newId = messages[messages.length-1].id+1
                    message.id = newId
                    messages.push(message)
                    await fs.promises.writeFile(pathToHistory, JSON.stringify(messages,null,2))
                    return{status:"success", message:"New Message Sent"} 
                }
            }else{
                let newMessage = Object.assign({id:1},message)
                await fs.promises.writeFile(pathToHistory, JSON.stringify([newMessage], null, 2)) 
                return{status:"success", message:"New Message Sent"}
            }
        }
        catch(error){
            return{status:"error", message:error}
        }
    }
    getAll = async () =>{
        if(fs.existsSync(pathToHistory)){
            let data = await fs.promises.readFile(pathToHistory,'utf-8')
            let history = JSON.parse(data)
            return(history)
        }
    }
}
module.exports = Container