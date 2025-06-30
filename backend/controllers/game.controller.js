import Game from "../models/game.model.js";
import Owner from "../models/owner.model.js";

// List all games (for players)
export const listGames = async (req, res) => {
    try {
        const { category, city, minPrice, maxPrice, search } = req.query;
        
        let query = {};
        
        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Filter by city
        if (city) {
            query.city = { $regex: city, $options: 'i' };
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

        res.render('games/list', {
            title: 'Available Games - Player Finder',
            user: req.session.user,
            games,
            filters: { category, city, minPrice, maxPrice, search }
        });

    } catch (error) {
        console.error('List games error:', error);
        res.status(500).render('error', {
            message: 'Error loading games',
            error: { status: 500 }
        });
    }
};

// Show game details (for players)
export const showGameDetails = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
            .populate('owner', 'name email phoneNum');

        if (!game) {
            return res.status(404).render('error', {
                message: 'Game not found',
                error: { status: 404 }
            });
        }

        res.render('games/detail', {
            title: `${game.name} - Player Finder`,
            user: req.session.user,
            game
        });

    } catch (error) {
        console.error('Game details error:', error);
        res.status(500).render('error', {
            message: 'Error loading game details',
            error: { status: 500 }
        });
    }
};

// Owner's game management

// List owner's games
export const listOwnerGames = async (req, res) => {
    try {
        const games = await Game.find({ owner: req.session.user.id })
            .sort({ createdAt: -1 });

        res.render('owner/games/list', {
            title: 'My Games - Player Finder',
            user: req.session.user,
            games
        });

    } catch (error) {
        console.error('Owner games list error:', error);
        res.status(500).render('error', {
            message: 'Error loading your games',
            error: { status: 500 }
        });
    }
};

// Show create game form
export const showCreateForm = (req, res) => {
    res.render('owner/games/create', {
        title: 'Add New Game - Player Finder',
        user: req.session.user,
        error: req.session.error
    });
    delete req.session.error;
};

// Create new game
export const createGame = async (req, res) => {
    try {
        const { name, description, category, city, pricePerHour, population } = req.body;

        // Validation
        if (!name || !category || !city || !pricePerHour) {
            req.session.error = 'All required fields must be filled';
            return res.redirect('/games/owner/create');
        }

        if (pricePerHour <= 0) {
            req.session.error = 'Price must be greater than 0';
            return res.redirect('/games/owner/create');
        }

        const game = new Game({
            name,
            description,
            category,
            city,
            pricePerHour: parseFloat(pricePerHour),
            population: parseInt(population) || 1,
            owner: req.session.user.id
        });

        await game.save();

        // Add game to owner's games array
        await Owner.findByIdAndUpdate(
            req.session.user.id,
            { $push: { games: game._id } }
        );

        res.redirect('/games/owner/list');

    } catch (error) {
        console.error('Create game error:', error);
        req.session.error = 'Error creating game. Please try again.';
        res.redirect('/games/owner/create');
    }
};

// Show edit game form
export const showEditForm = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).render('error', {
                message: 'Game not found',
                error: { status: 404 }
            });
        }

        if (game.owner.toString() !== req.session.user.id) {
            return res.status(403).render('error', {
                message: 'Access denied',
                error: { status: 403 }
            });
        }

        res.render('owner/games/edit', {
            title: `Edit ${game.name} - Player Finder`,
            user: req.session.user,
            game,
            error: req.session.error
        });
        delete req.session.error;

    } catch (error) {
        console.error('Edit form error:', error);
        res.status(500).render('error', {
            message: 'Error loading edit form',
            error: { status: 500 }
        });
    }
};

// Update game
export const updateGame = async (req, res) => {
    try {
        const { name, description, category, city, pricePerHour, population } = req.body;

        // Validation
        if (!name || !category || !city || !pricePerHour) {
            req.session.error = 'All required fields must be filled';
            return res.redirect(`/games/owner/${req.params.id}/edit`);
        }

        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).render('error', {
                message: 'Game not found',
                error: { status: 404 }
            });
        }

        if (game.owner.toString() !== req.session.user.id) {
            return res.status(403).render('error', {
                message: 'Access denied',
                error: { status: 403 }
            });
        }

        game.name = name;
        game.description = description;
        game.category = category;
        game.city = city;
        game.pricePerHour = parseFloat(pricePerHour);
        game.population = parseInt(population) || 1;

        await game.save();

        res.redirect('/games/owner/list');

    } catch (error) {
        console.error('Update game error:', error);
        req.session.error = 'Error updating game. Please try again.';
        res.redirect(`/games/owner/${req.params.id}/edit`);
    }
};

// Delete game
export const deleteGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).render('error', {
                message: 'Game not found',
                error: { status: 404 }
            });
        }

        if (game.owner.toString() !== req.session.user.id) {
            return res.status(403).render('error', {
                message: 'Access denied',
                error: { status: 403 }
            });
        }

        await Game.findByIdAndDelete(req.params.id);

        // Remove game from owner's games array
        await Owner.findByIdAndUpdate(
            req.session.user.id,
            { $pull: { games: req.params.id } }
        );

        res.redirect('/games/owner/list');

    } catch (error) {
        console.error('Delete game error:', error);
        res.status(500).render('error', {
            message: 'Error deleting game',
            error: { status: 500 }
        });
    }
};

// Check game availability
export const checkAvailability = async (req, res) => {
    try {
        const { date, timeRange } = req.body;
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        // Check if the requested time slot is available
        const isAvailable = !game.bookedSlots.some(slot => {
            if (slot.date === date) {
                return slot.timeRanges.some(range => {
                    const requestedFrom = new Date(`2000-01-01 ${timeRange.from}`);
                    const requestedTo = new Date(`2000-01-01 ${timeRange.to}`);
                    const bookedFrom = new Date(`2000-01-01 ${range.from}`);
                    const bookedTo = new Date(`2000-01-01 ${range.to}`);
                    
                    return (requestedFrom < bookedTo && requestedTo > bookedFrom);
                });
            }
            return false;
        });

        res.json({ available: isAvailable });

    } catch (error) {
        console.error('Availability check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

