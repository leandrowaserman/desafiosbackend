import fs from 'fs'

const checkIfExists = (path) =>{
    if (fs.existsSync(path)) return true
    return false
}
const getData = async(path) =>{
    let data = await fs.promises.readFile(path,'utf-8')
    let products = JSON.parse(data)
    return products
}

export {
    checkIfExists,
    getData
}