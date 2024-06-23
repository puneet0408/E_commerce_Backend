import { Product } from "../model/Products.js";
import asyncerrorhandler from "../asyncerrorhandler.js";
import CustomError from "../customError.js";
export const CreateProduct =  (req, res) => {
  const product = new Product(req.body);
  product
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(401).json(err));
};



export const tophighrated = (req , res, next) =>{
  req.query.limit = '20';
  req.query.sort = "-rating";
next(); 

}

export const fetchAllProducts = asyncerrorhandler( async (req, res) => {
  
    console.log(req.query)
     // this work for adding & 
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
    const quertobj = JSON.parse(queryStr);

console.log(quertobj);

// foe excluding the fields -----------------

    // this method for removing extra params from query string that someone pass diectly and for make  it error free in lower version of mongoose like 6.0 of lower.....

    // const excludeField  = ['sort' ,'page' ,'limit', 'felds'];
    // const queryobj = {...req.query};
    // excludeField.forEach((el)=>{
    //   delete queryobj[el]
    // })


    //delete queryObj.sort;
  
    let query = Product.find(quertobj);  // foe query filtering we simpllly pass query , we only pass those parameter in req.query that define in our schime for others it show error if we pass directly or it not give us any output likr if we user sort , limit etc
    
    if(req.query.sort){
      query = query.sort(req.query.sort);
    }
    
  //---------  limiting field

  if(req.query.fields){
    const fields = req.query.fields.split(',').join(' ');
   query =  query.select(fields);
  }else{
query = query.select('-__v');
  }

      // this will use wher you only sort 
//     let query = Product.find(quertobj);   
// let query1=Product.find(); 
// if(req.query.sort){
//        query=query1.sort(req.query.sort);
// }


//------ pagination 
if(req.query.page){
const page = req.query.page*1 || 1;  // req.query.page return string and muntply 1 simply se for convert strig into number
const limit = req.query.limit*1 || 10;
const skip = (page - 1) * limit;
query = query.skip(skip).limit(limit)
}

    const products = await query;


    res.json(products);
  
 
});

// export const filterproduct = async (req , res)=>{
//   try{
//     const product = await Product.find(req.query);
//     res.status(200).json({
//       status : 'success',
//       data:{
//         product
//       }
//     })
//   }catch(err){
//      res.status(404).json({
//       status:'fail',
//       message:err.message
//      })
//   }
// }

export const fetchProductBySeller = asyncerrorhandler (async (req, res) => {
  const { id } = req.params;


    const product = await Product.find({ sellerId: id });
     
    res.status(200).json(product);
  
});

export const fetchProductById = asyncerrorhandler( async (req, res , next) => {
  const id = req.params.id;
  
    const product = await Product.findById(id);
if(!product){
const error = new CustomError('movie with that id not found' , 404);
return next(error);
}
    res.status(200).json(product);
  
});

export const DeleteProduct = asyncerrorhandler (async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
    const doc = await Product.findOneAndDelete({ _id: id });
    if(!doc){
      const error = new CustomError('movie with that id not found' , 404);
      return next(error);
      }
    res.status(200).json(doc);
   
});

export const UpdateProduct = asyncerrorhandler ( async (req, res) => {
  const { id } = req.params;
  
    if (req.body.images) {
      const doc = await Product.findOneAndUpdate(
        { _id: id },
        { $push: { images: req.body.images } },
        {
          new: true,
        }
      );
      if(!doc){
        const error = new CustomError('movie with that id not found' , 404);
        return next(error);
        }
      res.status(200).json(doc);
    } else {
      console.log(req.body);
      const doc = await Product.findOneAndUpdate({ _id: id }, req.body, {
        new: true,  // we use new for return updated document
      });
      if(!doc){
        const error = new CustomError('movie with that id not found' , 404);
        return next(error);
        }
      res.status(200).json(doc);
    }
 
});


export const getproductstats = asyncerrorhandler(async (req ,res) => {
  
    const state = await Product.aggregate([
      { $match: { rating: { $gte: 3 } } },
      {$group: {
        _id:'$category',  // this element for group result 
        avgRating:{$avg:'$rating'},
        avgprice:{$avg:'$price'},
        minprice:{$min : '$price'},
        maxprice:{$max : '$price'},
        sumprice:{$sum : '$price'},
        productCount:{$sum : 1}

      }},  // second group stage result depend on frrst stage result means next reult depend on first 
      {$sort:{minprice:-1}}, // for sort accending order we asign 1 to it and -1 for decending 
      { $match: { maxprice: { $gte: 1000 } } }
    ]);
    res.status(200).json({
      status: 'success',
      count: state.length,
      data: { state }
    });
 
}); 