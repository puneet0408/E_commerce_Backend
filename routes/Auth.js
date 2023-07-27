import express from "express";

import { createUser , loginUser , Profile } from "../controller/Auth.js";

const router = express.Router();

router.post('/signup',createUser)
router.post('/login',loginUser)
router.get('/profile',Profile)
export default router;