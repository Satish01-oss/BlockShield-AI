const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../middleware/auth.middleware');

const {
    createTransactionHistory,
    getTransactionHistory,
    getSingleTransaction,
    deleteTransactionHistory
} = require('../controllers/transaction.controller');

router.post(
    '/create',
    authMiddleware,
    createTransactionHistory
);

router.get(
    '/history',
    authMiddleware,
    getTransactionHistory
);

router.get(
    '/:id',
    authMiddleware,
    getSingleTransaction
);

router.delete(
    '/delete/:id',
    authMiddleware,
    deleteTransactionHistory
);

module.exports = router;