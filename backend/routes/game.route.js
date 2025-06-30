import express from 'express';
import {
    listGames,
    showGameDetails,
    listOwnerGames,
    showCreateForm,
    createGame,
    showEditForm,
    updateGame,
    deleteGame,
    checkAvailability
} from '../controllers/game.controller.js';
import {
    ensureLoggedIn,
    ensurePlayer,
    ensureOwner,
    ensureGameOwner
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (for players)
router.get('/', listGames);
router.get('/:id', showGameDetails);

// Owner routes
router.get('/owner/list', ensureOwner, listOwnerGames);
router.get('/owner/create', ensureOwner, showCreateForm);
router.post('/owner/create', ensureOwner, createGame);
router.get('/owner/:id/edit', ensureGameOwner, showEditForm);
router.post('/owner/:id/edit', ensureGameOwner, updateGame);
router.post('/owner/:id/delete', ensureGameOwner, deleteGame);

// API routes for availability checking
router.post('/:id/check-availability', checkAvailability);

export default router;