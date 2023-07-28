import { fetchUserById, UpdateUser, DeleteUser } from "../controller/User.js";
import multer from "multer";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
const UserRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPath = path.join(__dirname, "../uploads");
//const server = express();
//server.use(express.static(uploadPath));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${uploadPath}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  }
});

const upload = multer({ storage: storage });

UserRouter.get("/:id", fetchUserById)
  .patch("/:id", upload.single("profilePic"), UpdateUser)
  .delete("/delete/:id", DeleteUser);

export default UserRouter;
