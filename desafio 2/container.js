const fs = require('fs')

const pathToData = './data.json'
class Container{
    save = async(user) => {
        if(!user.name || !user.username || !user.phone || !user.mail || !user.age){
            return{status:"error", error:"faltan completar datos"}
        }
        try{
            if(fs.existsSync(pathToData)){
                let data = await fs.promises.readFile(pathToData,'utf-8')
                let users = JSON.parse(data)
                if(users.length===0){
                    let newUser = Object.assign({id:1},user)
                    await fs.promises.writeFile(pathToData, JSON.stringify([newUser], null, 2)) 
                    return{status:"success", message:"New User Created", id:1}
                }else{
                    let newId = users[users.length-1].id+1
                    user.id = newId
                    users.push(user)
                    await fs.promises.writeFile(pathToData, JSON.stringify(users,null,2))
                    return{status:"success", message:"New User Created", id:newId} 
                }
            }else{
                let newUser = Object.assign({id:1},user)
                await fs.promises.writeFile(pathToData, JSON.stringify([newUser], null, 2)) 
                return{status:"success", message:"New User Created", id:1}
            }
        }
        catch(error){
            return{status:"error", message:error}
        }
    }
    getById = async(id)=>{
        if(fs.existsSync(pathToData)){
            let data = await fs.promises.readFile(pathToData,'utf-8')
            let users = JSON.parse(data)
            let user = users.find(u => u.id === id)
            if(user){
                return{status:"success",info:user}
            }
            else{
                return{status:"error", error:"User not found"}
            }
        }
    }
    getAll = async () =>{
        if(fs.existsSync(pathToData)){
            let data = await fs.promises.readFile(pathToData,'utf-8')
            let users = JSON.parse(data)
            return{status:"success",info:users}
        }
    }
    deleteById = async (id) =>{
        if(!id){
            return{status:"error", error:"Id needed"}
        }
        if(fs.existsSync(pathToData)){
            let data = await fs.promises.readFile(pathToData,'utf-8')
            let users = JSON.parse(data)
            let newUsers = users.filter(u => u.id !== id)
            await fs.promises.writeFile(pathToData,JSON.stringify(newUsers,null,2))
            return{status:"success",message:"User Deleted"}
        }
    }
    deleteAll = async () =>{
        if(fs.existsSync(pathToData)){
            let data = await fs.promises.readFile(pathToData,'utf-8')
            let users = JSON.parse(data)
            if(users.length===0){
                return{status:"error", error:"There are no Users"}
            }else{
                await fs.promises.writeFile(pathToData,'')
                return{status:"success",message:"All Users Deleted"}
            }
        }else{
            return{status:"error", error:"The file doesnt exist"}
        }
        
    }
}

module.exports = Container