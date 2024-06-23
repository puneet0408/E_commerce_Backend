import {
  CreateProduct,
  fetchAllProducts,
  fetchProductBySeller,
  UpdateProduct,
  DeleteProduct,
  fetchProductById,
  tophighrated,
  getproductstats
} from "../controller/Products.js";
import express from "express";

const ProductRouter = express.Router();

ProductRouter.post("/", CreateProduct)
  .get("/", fetchAllProducts)
  .get("/getproductstats",getproductstats)
  .get("/tophighrated" ,tophighrated, fetchAllProducts)
  .get("/seller/:id", fetchProductBySeller)
  .get("/:id", fetchProductById)
  .patch("/:id", UpdateProduct)
  .delete("/:id", DeleteProduct);

export default ProductRouter;
