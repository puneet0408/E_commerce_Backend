
import { User } from "../model/User.js";
 
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dygbz1kio', 
  api_key: '621454171282925', 
  api_secret: '7W20EzMnczOvtBgMihR27WC6X_I' 
});


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
  console.log(req.body, "body");
  const { name, addresses } = req.body;
  const { id } = req.params;

  try {
    let profilePicUrl = null;

    if (req.files && req.files.profilePic) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(req.files.profilePic.tempFilePath, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
            console.log(result, "result");
          }
        });
      });

      profilePicUrl = result.url;
    } else {
      const existingUser = await User.findById(id);
      profilePicUrl = existingUser.profilePic;
    }

    const doc = await User.findOneAndUpdate(
      { _id: id },
      { name: name, addresses: addresses, profilePic: profilePicUrl },
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
