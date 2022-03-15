import sqlOptions from "../options/mysqliteconfig.js"
import knex from 'knex'
const database = knex(sqlOptions)

class ChatManager {
    add = async(message) => {
        if(!message.user || !message.info || !message.date || !message.time){
            return{status:"error", error:"faltan completar datos"}
        }
        try{
            await database('history').insert(message)
            .then(()=>{
                return{status:"success", message: "message sent"}
            })
            .catch(console.log)
        }
        catch(error){
            return{status:"error", message:error}
        }
    }
    getAll = async () =>{
        let data = database.from('history').select('*')
        return(data)
    }
}
export default ChatManager
