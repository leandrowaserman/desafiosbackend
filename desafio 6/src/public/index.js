const socket = io();
let form = document.getElementById("productForm");
let chatBox = document.getElementById("chatBox")
let user
let getDate = new Date()

Swal.fire({
    title:"Ingresa tu nombre",
    input:"text",
    text:"Ingresa el nombre de usuario que vas a utilizar en el chat",
    inputValidator: (value) =>{
        return !value && "Necesitas ingresar un nombre válido"
    },
    allowOutsideClick:false
}).then(res=>{
    user=res.value
})

chatBox.addEventListener('keyup', (evt)=>{
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            let ddmmyy = [getDate.getFullYear(),getDate.getMonth(),getDate.getDate()].join('/')
            let hhmmss = [getDate.getHours(), getDate.getMinutes(), getDate.getSeconds()].join(':')
            socket.emit('message',{user:user, info:chatBox.value, date:ddmmyy, time:hhmmss})
            chatBox.value=""
        }
    }
})
socket.on('chatLog',(data)=>{
    let messages = data
    let chatLog = document.getElementById("log");
    fetch('templates/messageLog.handlebars').then(response=>{
        return response.text();
    }).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const html = processedTemplate({messages})
        chatLog.innerHTML = html;
    })
})

form.addEventListener('submit',(evt)=>{
    evt.preventDefault();
    let data = new FormData(form);
    let sendObj = {};
    data.forEach((val,key)=>sendObj[key]=val);
    socket.emit("sendProduct",sendObj);
    form.reset();
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