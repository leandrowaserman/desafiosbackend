import { addProduct, getAll } from "../services/daos.services.js";


const getData = async (req, res) => {
    let data = await getAll()
    res.json(data);
};
const postProduct = async(req,res)=>{
    let product = req.body;
    let added = await addProduct(product);
    res.json(added);
}
const getProductId = async(req,res)=>{
    let id = req.params.id
    let product = await getById(id)
    res.json(product)
}

export{
    getData,
    postProduct,
    getProductId,
}