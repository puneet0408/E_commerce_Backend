import { instance } from "../index.js";
import crypto from "crypto";
import { Orders } from "../model/orders.js";

export const checkout = async (req, res) => {
  console.log(req.body, "checkout");
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  try {
    const orders = await instance.orders.create(options);
    console.log(orders);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body.response;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const { id } = req.params;
  console.log(id, "id");

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZERPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");
console.log(generated_signature, "gen");
console.log(razorpay_signature,"prev");
  const isAutentic = generated_signature === razorpay_signature;

console.log(isAutentic);
  if (isAutentic) {
    try {
      const doc = await Orders.findByIdAndUpdate(
        { _id: id },
        { payment_status: "successful", paymentId: razorpay_payment_id },
        { new: true }
      );
      console.log(doc);
      res.status(200).json(doc);
      
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
