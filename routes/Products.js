import {
  CreateProduct,
  fetchAllProducts,
  fetchProductById,
  UpdateProduct,
  DeleteProduct,
} from "../controller/Products.js";
import express from "express";

const ProductRouter = express.Router();

ProductRouter.post("/", CreateProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", UpdateProduct)
  .delete("/:id", DeleteProduct);

export default ProductRouter;
