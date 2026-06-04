const transactionModel = require('../models/transaction.model');

// CREATE TRANSACTION HISTORY

async function createTransactionHistory(req, res) {

    const {
        walletAddress,
        transactionHash,
        prediction,
        confidence,
        riskScore,
        blockchainData
    } = req.body;

    try {

        const newTransaction =
            await transactionModel.create({
                userId: req.user.id,
                walletAddress,
                transactionHash,
                prediction,
                confidence,
                riskScore,
                blockchainData
            });

        res.status(201).json({
            message:
                'Transaction history saved successfully',
            transaction: newTransaction
        });

    } catch (err) {

        console.log(
            'Create Transaction Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// GET USER TRANSACTION HISTORY

async function getTransactionHistory(req, res) {

    try {

        const history =
            await transactionModel
                .find({
                    userId: req.user.id
                })
                .sort({ createdAt: -1 });

        res.status(200).json({
            message:
                'Transaction history fetched successfully',
            history
        });

    } catch (err) {

        console.log(
            'Get Transaction History Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// GET SINGLE TRANSACTION

async function getSingleTransaction(req, res) {

    const { id } = req.params;

    try {

        const transaction =
            await transactionModel.findById(id);

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            transaction
        });

    } catch (err) {

        console.log(
            'Get Single Transaction Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// DELETE TRANSACTION HISTORY

async function deleteTransactionHistory(req, res) {

    const { id } = req.params;

    try {

        const transaction =
            await transactionModel.findById(id);

        if (!transaction) {
            return res.status(404).json({
                message: 'Transaction not found'
            });
        }

        await transactionModel.findByIdAndDelete(id);

        res.status(200).json({
            message:
                'Transaction deleted successfully'
        });

    } catch (err) {

        console.log(
            'Delete Transaction Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = {
    createTransactionHistory,
    getTransactionHistory,
    getSingleTransaction,
    deleteTransactionHistory
};