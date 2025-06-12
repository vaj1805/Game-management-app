import express from 'express';
import {register , login, showLogin, showRegister} from "../controllers/auth.controller.js";

const router = express.Router();


//render login form.
router.get("/login" , showLogin);

//handle login submit.
router.post("/login" , login);

//render register form.
router.get("/register" , showRegister);

//handle user registration.
router.post("/register" , register);

export default router;

