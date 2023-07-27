import mongoose from "mongoose";
import { Schema } from "mongoose";

var ObjectId = mongoose.ObjectId;
const ordersSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  payment_status: {
    type: String,
    default: "pending",
  },

  items: { type: [Schema.Types.Mixed], required: true },

  paymentId: {
    type: String,
    default: "",
  },
  selectedAddress: { type: [Schema.Types.Mixed] },
});

export const Orders = mongoose.model("Orders", ordersSchema);
