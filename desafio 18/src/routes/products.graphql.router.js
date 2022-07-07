import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from "graphql"
import express from "express";

const productGQLRouter = express.Router()


const schema = buildSchema(`
      type Product{
        id: Int,
        name: String, 
        price: Int,
        thumbnail: String,
        stock: Int,
        description: String
      }

      type Query{
        products: [Product],
        product (id:Int): Product
      }

      type Mutation{
        addProduct(name: String, price: Int, thumbnail: String, stock: Int, description: String): Product
      }
`);
let products = []
let counter = 1
const root = {
    products: () => {
      return products;
    },
  
    product: (data) => {
      for (let i = 0; i < products.length; i++) {
        if (products[i].id == data.id) return products[i];
      }
      return null;
    },
  
    addProduct: (data) => {
      let newProduct = {
        id: counter,
        name: data.name, 
        price: data.price,
        thumbnail: data.thumbnail,
        stock: data.stock,
        description: data.description
      };
  
      products.push(newProduct);
      counter++;
      return newProduct;
    },
  };
  
productGQLRouter.use("/",graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:false
}))

export default productGQLRouter