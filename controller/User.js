//import mongoose from "mongoose";
//import fs from "fs";
import { User } from "../model/User.js";

export const fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.findById(id, "name email id");
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(err);
  }
};

export const UpdateUser = async (req, res) => {
  console.log(req.body);
  const { name, addresses } = req.body;
  const { id } = req.params;

  try {
    const existingData = await User.findById(id);
    let imagename = existingData.profilePic;
    if (req.file) {
      imagename = req.file.path;
    }


    const doc = await User.findOneAndUpdate(
      { _id: id },
      { name: name, addresses: addresses, profilePic: imagename },
      {
        new: true,
      }
    );
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};


export const DeleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await User.findOneAndDelete({ _id: id });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
