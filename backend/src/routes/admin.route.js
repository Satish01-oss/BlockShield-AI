const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../middleware/auth.middleware');

const {adminMiddleware} = require('../middleware/admin.middleware');

const {
    getAllUsers,
    getAllTransactions,
    deleteUser,
    getGlobalStats,
    getHighRiskTransactions,
    toggleBlockUser
} = require('../controllers/admin.controller');

router.get(
    '/users',
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

router.get(
    '/transactions',
    authMiddleware,
    adminMiddleware,
    getAllTransactions
);

router.delete(
    '/users/:id',
    authMiddleware,
    adminMiddleware,
    deleteUser
);

router.get(
    '/stats',
    authMiddleware,
    adminMiddleware,
    getGlobalStats
);

router.get(
    '/high-risk',
    authMiddleware,
    adminMiddleware,
    getHighRiskTransactions
);

router.put(
    '/block/:id',
    toggleBlockUser
);

module.exports = router;