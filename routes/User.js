import { fetchUserById, UpdateUser, DeleteUser } from "../controller/User.js";
import express from "express";
const UserRouter = express.Router();

UserRouter.get("/:id", fetchUserById)
  .patch("/:id", UpdateUser)
  .delete("/delete/:id", DeleteUser);

export default UserRouter;
