import express from 'express';
import { register, login, showLogin, showRegister, showAdmin, adminLogin, logout } from "../controllers/auth.controller.js";
import { ensureLoggedIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Render login form
router.get("/login", showLogin);

// Handle login submit
router.post("/login", login);

// Render register form
router.get("/register", showRegister);

// Handle user registration
router.post("/register", register);

// Logout
router.get("/logout", logout);

// Admin routes
router.get("/admin", showAdmin);
router.post("/admin", adminLogin);

export default router;

