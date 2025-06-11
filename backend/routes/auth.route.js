import express from 'express';
import {register , login, showLogin} from "../controllers/auth.controller.js";

const router = express.Router();


router.get("/login" , showLogin);
router.post("/login" , login);
router.post("/register" , register);

export default router;

