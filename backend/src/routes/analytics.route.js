const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../middleware/auth.middleware');

const {
    getDashboardStats,
    getRecentActivity,
    getMonthlyAnalytics,
    getRiskDistribution
} = require('../controllers/analytics.controller');

router.get(
    '/stats',
    authMiddleware,
    getDashboardStats
);

router.get(
    '/recent',
    authMiddleware,
    getRecentActivity
);

router.get(
    '/monthly',
    authMiddleware,
    getMonthlyAnalytics
);

router.get(
    '/risk-distribution',
    authMiddleware,
    getRiskDistribution
);

module.exports = router;