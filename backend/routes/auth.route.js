import express from 'express';
import {register , login, showLogin, showRegister } from "../controllers/auth.controller.js";
import {ensureLoggedIn} from "../middlewares/authMiddleware.js";

const router = express.Router();

//render login form.
router.get("/login" , showLogin);

//handle login submit.
router.post("/login" , login);

//render register form.
router.get("/register" , showRegister);

//handle user registration.
router.post("/register" , register);

//displaying dashboard
router.get("/dashboard" , ensureLoggedIn);

export default router;

