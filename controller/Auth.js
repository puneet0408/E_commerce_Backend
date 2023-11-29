import { User } from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "hjkhjkhjkhjkhuiuhjkhjk";

export const createUser = async (req, res) => {
  const { name, email, password , role } = req.body;
  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, bcryptSalt),
    role
  });
  try {
    const doc = await user.save();
    res.json(doc._id);
  } catch (error) {
    res.json((error.message = "error in account creation"));
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    const isauth = bcrypt.compareSync(password, userDoc.password);
    if (userDoc) {
      if (isauth) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.json({ token: token, user: userDoc });
          }
        );
      } else {
        res.status(422).json("invalid crenditials");
      }
    } else {
      res.status(400).json("user not found");
    }
  } catch (error) {
    res.status(401).json("user not found");
  }
};

export const Profile = async (req, res) => {
  const token = req.header('Authorization');

console.log(token , "token");
if (token && token.startsWith("Bearer ")) {
  const tokenValue = token.slice(7);
    jwt.verify(tokenValue, jwtSecret, {}, async (err, user) => {
      if(err){
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userDoc = await User.findById(user.id);
      res.json(userDoc);
      console.log(userDoc.name);
    });
  } else {
    res.status(422).json("can't get token");
  }
};
