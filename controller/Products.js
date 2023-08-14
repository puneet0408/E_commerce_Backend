import { Product } from "../model/Products.js";

export const CreateProduct = (req, res) => {
  const product = new Product(req.body);
  product
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((err) => res.status(401).json(err));
};

export const fetchAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const fetchProductBySeller = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.find({ sellerId: id });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const DeleteProduct = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const doc = await Product.findOneAndDelete({ _id: id });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const UpdateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.images) {
      const doc = await Product.findOneAndUpdate(
        { _id: id },
        { $push: { images: req.body.images } },
        {
          new: true,
        }
      );
      res.status(200).json(doc);
    } else {
      console.log(req.body);
      const doc = await Product.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      res.status(200).json(doc);
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
