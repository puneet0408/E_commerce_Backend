import express from "express";
import { checkout, paymentVerification } from "../controller/Payment.js";

const payment = express.Router();

payment
  .post("/checkout", checkout)
  .post("/paymentVerification/:id", paymentVerification);

export default payment;
