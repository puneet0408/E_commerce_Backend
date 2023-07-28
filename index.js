import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import path from "path";
import { dirname } from 'path';

import { config } from "dotenv";

import Razorpay from "razorpay";

config({ path: "./config/config.env" });

const server = express();
import ProductRouter from "./routes/Products.js";
import UserRouter from "./routes/User.js";
import Router from "./routes/Auth.js";
import payment from "./routes/paymentRoute.js";
import PlaceOrders from "./routes/PlaceOrder.js";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(`${process.env.MONGO_CLUSTER}`);
  console.log("database Connected");
}

export var instance = new Razorpay({
  key_id: process.env.RAZERPAY_KEY_ID,
  key_secret: process.env.RAZERPAY_SECRET_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildPath = path.resolve(__dirname, 'build');
server.use(express.static(buildPath));

server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));

 
server.use(express.static(__dirname,"./uploads"));

server.use(cors());

server.use("/products", ProductRouter);
server.use("/users", UserRouter);
server.use("/Auth", Router);
server.use("/payment", payment);
server.use("/purchase", PlaceOrders);
server.get("/payment/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZERPAY_KEY_ID })
);

server.get("/", (req, res) => {
  res.json({ status: "sucess" });
});

server.listen(process.env.PORT, () => {
  console.log("server started");
});
