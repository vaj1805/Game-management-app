import express from "express";
import { ensureLoggedIn, ensurePlayer } from "../middlewares/authMiddleware";


const router = express.Router();

//player booking
router.get("/games/:gameId/book", ensureLoggedIn , ensurePlayer);
router.post("/games/:gameId/book" , ensureLoggedIn , ensurePlayer);




export default router;