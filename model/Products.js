import mongoose from "mongoose";
import { Schema } from "mongoose";
import fs from 'fs';

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength:[100,"product name must not more than 100 char"],
    minlength:[5,"product name must not less than 5 char"],
    unique:true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min:[2,"it must not less than 2 nubers"],
    max:[5, "it must not greater than 5 digit" ],
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
  sellerId : {
    type:String,
    required:true
  }
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
// it is document middleware pre we use it if we done operation on data or add field in document before save it in database 
productSchema.pre('save',function(next){
  console.log(this);
  next();
})

// it is document middleware post we use it  after save data in model 
productSchema.post('save',function(doc , next){
  const content = `A product can pe added ${doc.title}`
   fs.writeFileSync('../log/lox.txt', content ,{flag:'a'},(err)=>{
    console.log(err.message);
   })
  next();
})

// productSchema.pre('aggregrate',function(next){
   
//   next();
// })
export const Product = mongoose.model("product", productSchema);
