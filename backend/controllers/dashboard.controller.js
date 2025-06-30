import User from '../models/user.model.js';
import Owner from '../models/owner.model.js';
import Game from '../models/game.model.js';
import Booking from '../models/booking.model.js';

// Player Dashboard
export const playerDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        // Get player's booking history
        const bookings = await Booking.find({ user: userId })
            .populate('game')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get available games in player's city
        const availableGames = await Game.find({ 
            city: req.session.user.city 
        }).populate('owner', 'name');

        res.render('dashboard/player', {
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
};

// Owner Dashboard
export const ownerDashboard = async (req, res) => {
    try {
        const ownerId = req.session.user.id;
        
        // Get owner's games
        const games = await Game.find({ owner: ownerId });
        
        // Get bookings for owner's games
        const bookings = await Booking.find({ 
            game: { $in: games.map(g => g._id) } 
        })
        .populate('game')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10);

        // Calculate total earnings
        const totalEarnings = bookings
            .filter(b => b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + b.totalPrice, 0);

        // Get recent bookings count
        const recentBookings = bookings.filter(b => {
            const bookingDate = new Date(b.createdAt);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return bookingDate > weekAgo;
        });

        res.render('dashboard/owner', {
            title: 'Owner Dashboard - Player Finder',
            user: req.session.user,
            games,
            bookings,
            totalEarnings,
            totalGames: games.length,
            recentBookings: recentBookings.length,
            totalBookings: bookings.length
        });

    } catch (error) {
        console.error('Owner dashboard error:', error);
        res.status(500).render('error', {
            message: 'Error loading dashboard',
            error: { status: 500 }
        });
    }
};

// Admin Dashboard
export const adminDashboard = async (req, res) => {
    try {
        // Get overall statistics
        const totalUsers = await User.countDocuments();
        const totalOwners = await Owner.countDocuments();
        const totalGames = await Game.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        // Get recent activities
        const recentBookings = await Booking.find()
            .populate('game')
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        const recentGames = await Game.find()
            .populate('owner', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        // Calculate total revenue
        const paidBookings = await Booking.find({ paymentStatus: 'paid' });
        const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

        res.render('dashboard/admin', {
            title: 'Admin Dashboard - Player Finder',
            user: req.session.user,
            stats: {
                totalUsers,
                totalOwners,
                totalGames,
                totalBookings,
                totalRevenue
            },
            recentBookings,
            recentGames
        });

    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).render('error', {
            message: 'Error loading admin dashboard',
            error: { status: 500 }
        });
    }
};

// Profile page
export const profile = async (req, res) => {
    try {
        const userId = req.session.user.id;
        let user;

        if (req.session.user.role === 'Owner') {
            user = await Owner.findById(userId);
        } else {
            user = await User.findById(userId);
        }

        if (!user) {
            return res.status(404).render('error', {
                message: 'User not found',
                error: { status: 404 }
            });
        }

        res.render('dashboard/profile', {
            title: 'Profile - Player Finder',
            user: req.session.user,
            profile: user
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).render('error', {
            message: 'Error loading profile',
            error: { status: 500 }
        });
    }
};

