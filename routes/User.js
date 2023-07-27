import { fetchUserById, UpdateUser, DeleteUser } from "../controller/User.js";
import multer from "multer";

import express from "express";
const UserRouter = express.Router();
server.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

UserRouter.get("/:id", fetchUserById)
  .patch("/:id", upload.single("profilePic"), UpdateUser)
  .delete("/delete/:id", DeleteUser);

export default UserRouter;
