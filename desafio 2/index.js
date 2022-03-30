const Container = require('./container')
const userCreator = new Container()

let user ={
    name: "Leandro Waserman",
    username:"Leanwaser",
    phone:"111111111",
    mail:"leandro@gmail.com",
    age:19
}

userCreator.save(user).then(res=>console.log(res))
//userCreator.getById(2).then(res=>console.log(res))
//userCreator.deleteById(4).then(res=>console.log(res))
//userCreator.getAll().then(res=>console.log(res))
//userCreator.deleteAll().then(res=>console.log(res))
