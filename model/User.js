import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  profilePic: { type: String, default: "" },
  password: {
    type: String,
    minLength: 5,
    required: true,
  },
  token: String,
  role: { type: String, required: true, default: "user" },
  addresses: { type: Schema.Types.Mixed },
  orders: { type: [Schema.Types.Mixed] },
});

export const User = mongoose.model("User", userSchema);
