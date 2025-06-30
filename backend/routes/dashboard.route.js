import express from "express";
import { 
    playerDashboard, 
    ownerDashboard, 
    adminDashboard, 
    profile 
} from '../controllers/dashboard.controller.js';
import { 
    ensureLoggedIn, 
    ensurePlayer, 
    ensureOwner, 
    ensureAdmin 
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Main dashboard route - redirects based on role
router.get('/', ensureLoggedIn, (req, res) => {
    const role = req.session.user.role;
    
    switch (role) {
        case 'Player':
            res.redirect('/dashboard/player');
            break;
        case 'Owner':
            res.redirect('/dashboard/owner');
            break;
        case 'Admin':
            res.redirect('/dashboard/admin');
            break;
        default:
            res.redirect('/auth/login');
    }
});

// Player dashboard
router.get('/player', ensurePlayer, playerDashboard);

// Owner dashboard
router.get('/owner', ensureOwner, ownerDashboard);

// Admin dashboard
router.get('/admin', ensureAdmin, adminDashboard);

// Profile page
router.get('/profile', ensureLoggedIn, profile);

export default router;



