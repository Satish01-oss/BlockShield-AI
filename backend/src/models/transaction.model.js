const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        walletAddress: {
            type: String,
            required: true
        },

        transactionHash: {
            type: String,
            required: true
        },

        prediction: {
            type: String,
            enum: ['Fraud', 'Safe'],
            required: true
        },

        confidence: {
            type: Number,
            required: true
        },

        riskScore: {
            type: Number,
            required: true
        },

        blockchainData: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

const transactionModel = mongoose.model(
    'TransactionHistory',
    transactionSchema
);

module.exports = transactionModel;