const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const adminMiddleware = require('../../middlewares/admin.middleware');

// Guest Route
router.post('/register', controller.register);
router.post('/login', controller.login);

// Auth Route
router.get('/', authMiddleware, controller.getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, controller.getUserById);

module.exports = router;
