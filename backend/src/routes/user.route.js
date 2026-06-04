const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../middleware/auth.middleware');

const {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
} = require('../controllers/user.controller');

router.get(
    '/profile',
    authMiddleware,
    getProfile
);

router.put(
    '/update-profile',
    authMiddleware,
    updateProfile
);

router.put(
    '/change-password',
    authMiddleware,
    changePassword
);

router.delete(
    '/delete-account',
    authMiddleware,
    deleteAccount
);

module.exports = router;