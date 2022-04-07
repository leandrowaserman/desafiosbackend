
const socket = io();
let productForm = document.getElementById("productForm");
let registerForm = document.getElementById("register");
let chatBox = document.getElementById("chatBox")
let mailBox = document.getElementById("mailBox")
let getDate = new Date()



registerForm.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    let data = new FormData(registerForm)
    let user = {}
    data.forEach((val,key)=>user[key]=val)
    socket.emit("sendUser",user)
    registerForm.reset()
})

chatBox.addEventListener('keyup', (evt)=>{
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0 && mailBox.value.trim().length>0){
            let ddmmyy = [getDate.getFullYear(),getDate.getMonth(),getDate.getDate()].join('/')
            let hhmmss = [getDate.getHours(), getDate.getMinutes(), getDate.getSeconds()].join(':')
            socket.emit('message',{info:chatBox.value, date:ddmmyy, time:hhmmss}, mailBox.value)
            chatBox.value=""
        }
    }
})
socket.on('chatLog',(data)=>{
    let messages = data
    const author = new normalizr.schema.Entity('author')
    const messageSchema = ('messages',{
        author:author
    })
    let normalData = normalizr.denormalize(messages.result,messageSchema,messages.entities)
    console.log({normalData})
    let chatLog = document.getElementById("log");
    fetch('templates/messageLog.handlebars').then(response=>{
        return response.text();
    }).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const html = processedTemplate({normalData})
        chatLog.innerHTML = html;
    })
})

productForm.addEventListener('submit',(evt)=>{
    evt.preventDefault();
    let data = new FormData(productForm);
    let sendObj = {};
    data.forEach((val,key)=>sendObj[key]=val);
    socket.emit("sendProduct",sendObj);
    productForm.reset();
})


socket.on('productLog',(data)=>{
    let products = data
    let productsTemplate = document.getElementById("productsTemplate");
    fetch('templates/newestProducts.handlebars').then(response=>{
        return response.text();
    }).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const html = processedTemplate({products})
        productsTemplate.innerHTML = html;
    })
})