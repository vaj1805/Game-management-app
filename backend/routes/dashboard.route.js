import express from "express";
import {ensureLoggedIn , ensurePlayer , ensureOwner} from "../middlewares/authMiddleware.js"
import { showOwnerDashboard , showPlayerDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();



router.get("/player" , ensureLoggedIn , ensurePlayer , showPlayerDashboard);

router.get("/owner" , ensureLoggedIn , ensureOwner , showOwnerDashboard);


export default router;



