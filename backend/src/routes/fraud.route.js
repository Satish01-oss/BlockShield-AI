const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../middleware/auth.middleware');

const {
    analyzeTransaction
} = require('../controllers/fraud.controller');

router.post(
    '/analyze',
    authMiddleware,
    analyzeTransaction
);

module.exports = router;