import express from "express";
import { getProductId, getData, postProduct } from "../controllers/products.controller.js";

const productRouter = express.Router()

productRouter.get("/",getData)
productRouter.get("/:id",getProductId)
productRouter.post("/",postProduct)

export default productRouter