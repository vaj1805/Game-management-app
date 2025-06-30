import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import Razorpay from "razorpay";
import path from "path";
import { fileURLToPath } from 'url';

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import gameRoutes from "./routes/game.route.js";
import bookingRoutes from "./routes/booking.route.js";
import playerRoutes from "./routes/player.router.js";

dotenv.config();
const PORT = process.env.PORT || 8001;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connect database;
connectDB();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Global middleware to make user available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/games", gameRoutes);
app.use("/bookings", bookingRoutes);
app.use("/player", playerRoutes);
app.use("/dashboard", dashboardRoutes);



// Home page
app.get("/", (req, res) => {
    res.render("homepage", { 
        title: "Player Finder - Game Rental & Management System",
        user: req.session.user 
    });
});

// Redirect root to home
app.get("/home", (req, res) => {
    res.redirect("/");
});

// 404 handler
app.use((req, res) => {
    res.status(404).render("error", { 
        message: "Page not found",
        error: { status: 404 }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", { 
        message: "Something went wrong!",
        error: err
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

