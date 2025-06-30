import Booking from "../models/booking.model.js";
import Game from "../models/game.model.js";
import User from '../models/user.model.js';
import Owner from '../models/owner.model.js';

// Show booking form
export const showBookingForm = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
            .populate('owner', 'name');

        if (!game) {
            return res.status(404).render('error', {
                message: 'Game not found',
                error: { status: 404 }
            });
        }

        res.render('bookings/form', {
            title: `Book ${game.name} - Player Finder`,
            user: req.session.user,
            game
        });

    } catch (error) {
        console.error('Booking form error:', error);
        res.status(500).render('error', {
            message: 'Error loading booking form',
            error: { status: 500 }
        });
    }
};

// Create booking
export const createBooking = async (req, res) => {
    try {
        const { date, timeFrom, timeTo, quantity } = req.body;
        const gameId = req.params.id;
        const userId = req.session.user.id;

        // Validation
        if (!date || !timeFrom || !timeTo || !quantity) {
            req.session.error = 'All fields are required';
            return res.redirect(`/bookings/${gameId}/book`);
        }

        if (quantity < 1) {
            req.session.error = 'Quantity must be at least 1';
            return res.redirect(`/bookings/${gameId}/book`);
        }

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).render('error', {
                message: 'Game not found',
                error: { status: 404 }
            });
        }

        // Check availability
        const isAvailable = !game.bookedSlots.some(slot => {
            if (slot.date === date) {
                return slot.timeRanges.some(range => {
                    const requestedFrom = new Date(`2000-01-01 ${timeFrom}`);
                    const requestedTo = new Date(`2000-01-01 ${timeTo}`);
                    const bookedFrom = new Date(`2000-01-01 ${range.from}`);
                    const bookedTo = new Date(`2000-01-01 ${range.to}`);
                    
                    return (requestedFrom < bookedTo && requestedTo > bookedFrom);
                });
            }
            return false;
        });

        if (!isAvailable) {
            req.session.error = 'Selected time slot is not available';
            return res.redirect(`/bookings/${gameId}/book`);
        }

        // Calculate total price
        const hours = (new Date(`2000-01-01 ${timeTo}`) - new Date(`2000-01-01 ${timeFrom}`)) / (1000 * 60 * 60);
        const totalPrice = game.pricePerHour * hours * quantity;

        // Create booking
        const booking = new Booking({
            user: userId,
            game: gameId,
            date,
            timeRange: {
                from: timeFrom,
                to: timeTo
            },
            quantity,
            totalPrice,
            paymentStatus: 'pending'
        });

        await booking.save();

        // Update game's booked slots
        const existingSlot = game.bookedSlots.find(slot => slot.date === date);
        if (existingSlot) {
            existingSlot.timeRanges.push({
                from: timeFrom,
                to: timeTo
            });
        } else {
            game.bookedSlots.push({
                date,
                timeRanges: [{
                    from: timeFrom,
                    to: timeTo
                }]
            });
        }
        await game.save();

        // Add booking to user's history
        await User.findByIdAndUpdate(
            userId,
            { $push: { bookingHistory: booking._id } }
        );

        // Redirect to payment or booking confirmation
        res.redirect(`/bookings/${booking._id}/payment`);

    } catch (error) {
        console.error('Create booking error:', error);
        req.session.error = 'Error creating booking. Please try again.';
        res.redirect(`/bookings/${req.params.id}/book`);
    }
};

// Show payment page
export const showPayment = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('game')
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).render('error', {
                message: 'Booking not found',
                error: { status: 404 }
            });
        }

        if (booking.user._id.toString() !== req.session.user.id) {
            return res.status(403).render('error', {
                message: 'Access denied',
                error: { status: 403 }
            });
        }

        res.render('bookings/payment', {
            title: 'Payment - Player Finder',
            user: req.session.user,
            booking
        });

    } catch (error) {
        console.error('Payment page error:', error);
        res.status(500).render('error', {
            message: 'Error loading payment page',
            error: { status: 500 }
        });
    }
};

// Process payment
export const processPayment = async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).render('error', {
                message: 'Booking not found',
                error: { status: 404 }
            });
        }

        if (booking.user.toString() !== req.session.user.id) {
            return res.status(403).render('error', {
                message: 'Access denied',
                error: { status: 403 }
            });
        }

        // For demo purposes, mark as paid
        // In production, integrate with actual payment gateway
        booking.paymentStatus = 'paid';
        await booking.save();

        // Update owner's earnings
        const game = await Game.findById(booking.game);
        if (game) {
            await Owner.findByIdAndUpdate(
                game.owner,
                { $inc: { totalEarnings: booking.totalPrice } }
            );
        }

        res.redirect(`/bookings/${bookingId}/success`);

    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).render('error', {
            message: 'Payment processing failed',
            error: { status: 500 }
        });
    }
};

// Show booking success
export const showBookingSuccess = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('game')
            .populate('user', 'name');

        if (!booking) {
            return res.status(404).render('error', {
                message: 'Booking not found',
                error: { status: 404 }
            });
        }

        res.render('bookings/success', {
            title: 'Booking Successful - Player Finder',
            user: req.session.user,
            booking
        });

    } catch (error) {
        console.error('Booking success error:', error);
        res.status(500).render('error', {
            message: 'Error loading booking confirmation',
            error: { status: 500 }
        });
    }
};

// Player's booking history
export const playerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.session.user.id })
            .populate('game')
            .sort({ createdAt: -1 });

        res.render('bookings/player-list', {
            title: 'My Bookings - Player Finder',
            user: req.session.user,
            bookings
        });

    } catch (error) {
        console.error('Player bookings error:', error);
        res.status(500).render('error', {
            message: 'Error loading bookings',
            error: { status: 500 }
        });
    }
};

// Owner's booking list
export const ownerBookings = async (req, res) => {
    try {
        // Get owner's games
        const games = await Game.find({ owner: req.session.user.id });
        const gameIds = games.map(g => g._id);

        // Get bookings for owner's games
        const bookings = await Booking.find({ game: { $in: gameIds } })
            .populate('game')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.render('bookings/owner-list', {
            title: 'Game Bookings - Player Finder',
            user: req.session.user,
            bookings
        });

    } catch (error) {
        console.error('Owner bookings error:', error);
        res.status(500).render('error', {
            message: 'Error loading bookings',
            error: { status: 500 }
        });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('game');

        if (!booking) {
            return res.status(404).render('error', {
                message: 'Booking not found',
                error: { status: 404 }
            });
        }

        // Only allow cancellation if user owns the booking or owns the game
        if (booking.user.toString() !== req.session.user.id && 
            booking.game.owner.toString() !== req.session.user.id) {
            return res.status(403).render('error', {
                message: 'Access denied',
                error: { status: 403 }
            });
        }

        // Remove booking from game's booked slots
        const game = await Game.findById(booking.game._id);
        if (game) {
            const slotIndex = game.bookedSlots.findIndex(slot => slot.date === booking.date);
            if (slotIndex !== -1) {
                const timeRangeIndex = game.bookedSlots[slotIndex].timeRanges.findIndex(
                    range => range.from === booking.timeRange.from && range.to === booking.timeRange.to
                );
                if (timeRangeIndex !== -1) {
                    game.bookedSlots[slotIndex].timeRanges.splice(timeRangeIndex, 1);
                    if (game.bookedSlots[slotIndex].timeRanges.length === 0) {
                        game.bookedSlots.splice(slotIndex, 1);
                    }
                    await game.save();
                }
            }
        }

        // Delete the booking
        await Booking.findByIdAndDelete(req.params.id);

        res.redirect('/bookings/my');

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).render('error', {
            message: 'Error cancelling booking',
            error: { status: 500 }
        });
    }
};