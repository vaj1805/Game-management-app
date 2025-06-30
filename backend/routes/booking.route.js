import express from "express";
import { ensureLoggedIn, ensurePlayer , ensureOwner} from "../middlewares/authMiddleware.js";
import {
    showBookingForm,
    createBooking,
    showPayment,
    processPayment,
    showBookingSuccess,
    playerBookings,
    ownerBookings,
    cancelBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

// Booking creation (for players)
router.get('/:id/book', ensurePlayer, showBookingForm);
router.post('/:id/book', ensurePlayer, createBooking);

// Payment routes
router.get('/:id/payment', ensureLoggedIn, showPayment);
router.post('/:id/payment', ensureLoggedIn, processPayment);
router.get('/:id/success', ensureLoggedIn, showBookingSuccess);

// Booking management
router.get('/my', ensurePlayer, playerBookings);
router.get('/owner', ensureOwner, ownerBookings);

// Cancel booking
router.post('/:id/cancel', ensureLoggedIn, cancelBooking);

export default router;