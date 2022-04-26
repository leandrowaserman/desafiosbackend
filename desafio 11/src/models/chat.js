import mongoose from 'mongoose'
const chatCollection = 'chat'
const userCollection = 'users'

const UserSchema = new mongoose.Schema({
    mail:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true  
    },
    last_name:{
        type:String,
        required:true 
    },
    age:{
        type:Number,
        required:true  
    },
    username:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const ChatSchema = new mongoose.Schema({
    author: {
        type: UserSchema,
        required: true
    },
    text:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
})
const ChatModel = mongoose.model(chatCollection,ChatSchema)
const UserModel = mongoose.model(userCollection,UserSchema)

export {
    ChatModel,
    UserModel
}