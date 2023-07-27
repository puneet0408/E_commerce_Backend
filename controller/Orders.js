import { Orders } from "../model/orders.js";
import { User } from "../model/User.js";

export const placeOrder = (req, res) => {
  const { userId, amount, items, addresses } = req.body;
  const user = userId;
  const payment_status = false;

  const selectedAddress = addresses;
  const Purchase = new Orders({
    user,
    amount,
    payment_status,
    items,
    selectedAddress,
  });
  Purchase.save()
    .then((doc) => {
      res.status(200).json(doc);
      User.findOne({ _id: doc.user })
        .then((document) => {
          if (document) {
            document.orders.unshift(items);
            return document.save();
          } else {
            console.log("User not found with ID:", doc.user);
            return Promise.reject("User not found");
          }
        })
        .catch((err) => {
          console.error("Error while updating user document:", err);
        });
    })
    .catch((err) => {
      console.error("Error while saving Transition:", err);
    });
};

export const fetchOrders = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const orders = await Orders.find({ user: id });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const DeleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Orders.findOneAndDelete({ _id: id });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
