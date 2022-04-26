import { UserModel } from "../models/chat.js";

class UserManager {
    add = async (user) =>{
        await UserModel.create(user)
        return {status:"success", message:"Registration completed"}
    }
    getByMail = async (mail) =>{
        if(!mail) return{status:"error", error:"Mail needed"}
        let search = await UserModel.find({mail:mail})
        if(search) return(search)
        return{status:"error", error:"user not found"}
    }
}

export default UserManager