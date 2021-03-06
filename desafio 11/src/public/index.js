
const socket = io();
let productForm = document.getElementById("productForm");
let chatBox = document.getElementById("chatBox")
let getDate = new Date()



chatBox.addEventListener('keyup', (evt)=>{
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            let ddmmyy = [getDate.getFullYear(),getDate.getMonth(),getDate.getDate()].join('/')
            let hhmmss = [getDate.getHours(), getDate.getMinutes(), getDate.getSeconds()].join(':')
            socket.emit('message',{info:chatBox.value, date:ddmmyy, time:hhmmss})
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
    let chatLog = document.getElementById("log");
    fetch('templates/messageLog.handlebars').then(response=>{
        return response.text();
    }).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const html = processedTemplate({normalData})
        chatLog.innerHTML = html;
    })
})

socket.on('userCheck',()=>{
    let linksIndex = document.getElementById("linksIndex")
    fetch('/afuhgaisufbvasfa').then(r=> r.json()).then(data=>{
        console.log(data)
        let size = Object.keys(data).length
        if(!size)return
        fetch('templates/userconnected.handlebars').then(response=>{
            return response.text()
        }).then(template=>{
            const processedTemplate = Handlebars.compile(template)
            const html = processedTemplate(data)
            linksIndex.innerHTML = html
        })
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