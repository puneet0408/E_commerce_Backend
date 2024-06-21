import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import { config } from "dotenv";
import Razorpay from "razorpay";
config({ path: "./config/config.env" });
import fileUpload from "express-fileupload";
import CustomError from "./customError.js";
import glbalerrorhandler from "./controller/errorControlar.js";

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception occurred, shutting down...");
  process.exit(1);
})

const server = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};

server.use(cors(corsOptions));

import ProductRouter from "./routes/Products.js";
import UserRouter from "./routes/User.js";
import Router from "./routes/Auth.js";
import payment from "./routes/paymentRoute.js";
import PlaceOrders from "./routes/PlaceOrder.js";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_CLUSTER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database Connected");
}

export const instance = new Razorpay({
  key_id: process.env.RAZERPAY_KEY_ID,
  key_secret: process.env.RAZERPAY_SECRET_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const buildPath = path.resolve(__dirname, "build");

server.use(express.static(buildPath));
server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));
server.use(fileUpload({ useTempFiles: true }));

server.use("/products", ProductRouter);
server.use("/users", UserRouter);
server.use("/Auth", Router);
server.use("/payment", payment);
server.use("/purchase", PlaceOrders);

server.get("/payment/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZERPAY_KEY_ID });
});

server.all('*', (req, res, next) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});
server.use(glbalerrorhandler);

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

const app = server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
