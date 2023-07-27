import mongoose from "mongoose";
import { Schema } from "mongoose";
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique:true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number
  },
  discountPercentage: {
    type: Number
  },
  rating: {
    type: Number
  },
  stock: {
    type: Number
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  images: {
    type: [String]
  },
  deleted: {
    type: Boolean,
    default: false
  },
});

const virtual = productSchema.virtual('id');
virtual.get((function(){
    return this._id;
}))
productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret) {delete ret._id}
})

export const Product = mongoose.model("product", productSchema);
