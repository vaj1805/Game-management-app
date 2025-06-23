import Booking from "../models/booking.model.js";
import Game from "../models/game.model.js";

export async function showBookingForm(req,res,next) {
    const {gameId} = req.params;
    try {
        const game = await Game.findById(gameId);
        if(!game) return res.status(404).send("Game not found");

        res.render("")
    } catch(error) {
        next(error);
    }
}

export async function createBooking(req,res,next) {
    const {gameId} = req.params;
    
}

export async function listPlayerBookings(req,res,next) {

}

export async function listOwnerBookings(req,res,next) {
    try {

    } catch(error) {
        next(error);
    }   
}