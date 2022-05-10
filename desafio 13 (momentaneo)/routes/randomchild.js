const randomNumbers = (cant) => {
    let numbers = []
    for(let i=0;i<cant;i++){
        let newNumber = parseInt(Math.floor(Math.random() * 1000))
        numbers.push(newNumber)
    }
    return numbers
}

process.on("message",parentMsg=>{
    if(isNaN(parentMsg)){
        const numbers = randomNumbers(5)
        process.send(numbers)
    }else{
        const numbers = randomNumbers(parentMsg)
        process.send(numbers)
    }
})