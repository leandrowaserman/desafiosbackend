import { ChatModel } from "../models/chat.js"
import {schema,normalize } from 'normalizr';

class ChatManager {
    add = async(message, user) => {
        let finalMessage = {author:{_id:user._id, mail:user.mail, name:user.name, last_name:user.last_name, age:user.age, username:user.username, avatar:user.avatar},text:message.info, time:message.time, date:message.date}
        await ChatModel.create(finalMessage)
        .then(()=>{
            return{status:"success", message: "message sent"}
        })
        .catch(console.log)
    }
    getAll = async () =>{
        let messages = await ChatModel.find()
        const author = new schema.Entity('author')
        const messageSchema = ('messages',{
            author:author
        })
        const normalizedData = normalize(messages,messageSchema)
        return normalizedData

    }
}
export default ChatManager
