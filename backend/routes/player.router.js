import express from 'express';
import { ensurePlayer } from '../middlewares/authMiddleware.js';
import Game from '../models/game.model.js';

const router = express.Router();

// Player's game browsing
router.get('/list', ensurePlayer, async (req, res) => {
    try {
        const { category, city, minPrice, maxPrice, search } = req.query;
        
        let query = {};
        
        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Filter by city (default to player's city if not specified)
        if (city) {
            query.city = { $regex: city, $options: 'i' };
        } else {
            query.city = req.session.user.city;
        }
        
        // Filter by price range
        if (minPrice || maxPrice) {
            query.pricePerHour = {};
            if (minPrice) query.pricePerHour.$gte = parseFloat(minPrice);
            if (maxPrice) query.pricePerHour.$lte = parseFloat(maxPrice);
        }
        
        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const games = await Game.find(query)
            .populate('owner', 'name')
            .sort({ createdAt: -1 });

        res.render('player/games/list', {
            title: 'Available Games - Player Finder',
            user: req.session.user,
            games,
            filters: { category, city, minPrice, maxPrice, search }
        });

    } catch (error) {
        console.error('Player games list error:', error);
        res.status(500).render('error', {
            message: 'Error loading games',
            error: { status: 500 }
        });
    }
});

// Player's game details
router.get('/games/:id', ensurePlayer, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
            .populate('owner', 'name email phoneNum');

        if (!game) {
            return res.status(404).render('error', {
                message: 'Game not found',
                error: { status: 404 }
            });
        }

        res.render('player/games/detail', {
            title: `${game.name} - Player Finder`,
            user: req.session.user,
            game
        });

    } catch (error) {
        console.error('Player game details error:', error);
        res.status(500).render('error', {
            message: 'Error loading game details',
            error: { status: 500 }
        });
    }
});

// Player dashboard
router.get('/', ensurePlayer, async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        // Get player's recent bookings
        const Booking = (await import('../models/booking.model.js')).default;
        const bookings = await Booking.find({ user: userId })
            .populate('game')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get available games in player's city
        const availableGames = await Game.find({ 
            city: req.session.user.city 
        }).populate('owner', 'name').limit(6);

        res.render('player/player', {
            title: 'Player Dashboard - Player Finder',
            user: req.session.user,
            bookings,
            availableGames,
            totalBookings: bookings.length
        });

    } catch (error) {
        console.error('Player dashboard error:', error);
        res.status(500).render('error', {
            message: 'Error loading dashboard',
            error: { status: 500 }
        });
    }
});

export default router;

