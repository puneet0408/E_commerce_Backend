import express from "express";
import { placeOrder, fetchOrders, DeleteOrder } from "../controller/Orders.js";

const PlaceOrders = express.Router();

PlaceOrders.post("/placeOrder", placeOrder)
  .get("/:id", fetchOrders)
  .delete("/:id", DeleteOrder);

export default PlaceOrders;
