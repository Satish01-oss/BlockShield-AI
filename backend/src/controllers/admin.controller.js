const userModel = require('../models/user.model');

const transactionModel = require('../models/transaction.model');

// GET ALL USERS

async function getAllUsers(req, res) {

    try {

        const users = await userModel
            .find()
            .select('-password');

        res.status(200).json({
            message: 'Users fetched successfully',
            totalUsers: users.length,
            users
        });

    } catch (err) {

        console.log(
            'Get All Users Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// GET ALL TRANSACTIONS

async function getAllTransactions(req, res) {

    try {

        const transactions =
            await transactionModel
                .find()
                .populate(
                    'userId',
                    'userName email role'
                )
                .sort({ createdAt: -1 });

        res.status(200).json({
            message:
                'Transactions fetched successfully',
            totalTransactions:
                transactions.length,
            transactions
        });

    } catch (err) {

        console.log(
            'Get All Transactions Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// DELETE USER

async function deleteUser(req, res) {

    const { id } = req.params;

    try {

        const user =
            await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await userModel.findByIdAndDelete(id);

        await transactionModel.deleteMany({
            userId: id
        });

        res.status(200).json({
            message:
                'User deleted successfully'
        });

    } catch (err) {

        console.log(
            'Delete User Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// GLOBAL STATS

async function getGlobalStats(req, res) {

    try {

        const totalUsers =
            await userModel.countDocuments();

        const totalTransactions =
            await transactionModel.countDocuments();

        const fraudTransactions =
            await transactionModel.countDocuments({
                prediction: 'Fraud'
            });

        const safeTransactions =
            await transactionModel.countDocuments({
                prediction: 'Safe'
            });

        const highRiskTransactions =
            await transactionModel.countDocuments({
                riskScore: {
                    $gt: 70
                }
            });

        res.status(200).json({
            totalUsers,
            totalTransactions,
            fraudTransactions,
            safeTransactions,
            highRiskTransactions
        });

    } catch (err) {

        console.log(
            'Global Stats Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// GET HIGH RISK TRANSACTIONS

async function getHighRiskTransactions(
    req,
    res
) {

    try {

        const highRiskTransactions =
            await transactionModel
                .find({
                    riskScore: {
                        $gt: 70
                    }
                })
                .populate(
                    'userId',
                    'userName email'
                )
                .sort({ riskScore: -1 });

        res.status(200).json({
            totalHighRisk:
                highRiskTransactions.length,
            highRiskTransactions
        });

    } catch (err) {

        console.log(
            'High Risk Transactions Error:',
            err.message
        );

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

async function toggleBlockUser(req, res) {

    const { id } = req.params;

    try {

        const user =
            await userModel.findById(id);

        if (!user) {

            return res.status(404).json({

                message:
                    'User not found'

            });
        }

        user.isBlocked =
            !user.isBlocked;

        await user.save();

        res.status(200).json({

            message:
                user.isBlocked
                    ? 'User blocked successfully'
                    : 'User unblocked successfully',

            user

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message:
                'Internal server error'

        });
    }
}

module.exports = {
    getAllUsers,
    getAllTransactions,
    deleteUser,
    getGlobalStats,
    getHighRiskTransactions,
    toggleBlockUser
};