// Middleware to ensure user is logged in
export const ensureLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

// Middleware to ensure user is not logged in (for login/register pages)
export const ensureNotLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
};

// Middleware to check if user is a Player
export const ensurePlayer = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    if (req.session.user.role !== 'Player') {
        return res.status(403).render('error', { 
            message: 'Access denied. Player access required.',
            error: { status: 403 }
        });
    }
    next();
};

// Middleware to check if user is an Owner
export const ensureOwner = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    if (req.session.user.role !== 'Owner') {
        return res.status(403).render('error', { 
            message: 'Access denied. Owner access required.',
            error: { status: 403 }
        });
    }
    next();
};

// Middleware to check if user is an Admin
export const ensureAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    if (req.session.user.role !== 'Admin') {
        return res.status(403).render('error', { 
            message: 'Access denied. Admin access required.',
            error: { status: 403 }
        });
    }
    next();
};

// Middleware to check if user owns the game
export const ensureGameOwner = async (req, res, next) => {
    try {
        if (!req.session.user || req.session.user.role !== 'Owner') {
            return res.status(403).render('error', { 
                message: 'Access denied.',
                error: { status: 403 }
            });
        }

        const Game = (await import('../models/game.model.js')).default;
        const game = await Game.findById(req.params.id);
        
        if (!game) {
            return res.status(404).render('error', { 
                message: 'Game not found.',
                error: { status: 404 }
            });
        }

        if (game.owner.toString() !== req.session.user.id) {
            return res.status(403).render('error', { 
                message: 'Access denied. You can only manage your own games.',
                error: { status: 403 }
            });
        }

        req.game = game;
        next();
    } catch (error) {
        console.error('Game owner check error:', error);
        res.status(500).render('error', { 
            message: 'Server error.',
            error: { status: 500 }
        });
    }
};

