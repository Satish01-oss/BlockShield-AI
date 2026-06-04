const transactionModel = require('../models/transaction.model');

// DASHBOARD STATS

async function getDashboardStats(req, res) {

    try {

        const totalScans =
            await transactionModel.countDocuments({
                userId: req.user.id
            });

        const fraudDetected =
            await transactionModel.countDocuments({
                userId: req.user.id,
                prediction: 'Fraud'
            });

        const safeTransactions =
            await transactionModel.countDocuments({
                userId: req.user.id,
                prediction: 'Safe'
            });

        const confidenceData =
            await transactionModel.find({
                userId: req.user.id
            });

        const totalConfidence =
            confidenceData.reduce(
                (acc, item) =>
                    acc + item.confidence,
                0
            );

        const averageConfidence =
            confidenceData.length > 0
                ? (
                    totalConfidence /
                    confidenceData.length
                ).toFixed(2)
                : 0;

        res.status(200).json({
            totalScans,
            fraudDetected,
            safeTransactions,
            averageConfidence
        });

    } catch (err) {

        console.log(
            'Dashboard Stats Error:',
            err.message
        );

        res.status(500).json({
            message:
                'Internal server error'
        });
    }
}

// RECENT ACTIVITY

async function getRecentActivity(req, res) {

    try {

        const recentTransactions =
            await transactionModel
                .find({
                    userId: req.user.id
                })
                .sort({ createdAt: -1 })
                .limit(5);

        res.status(200).json({
            recentTransactions
        });

    } catch (err) {

        console.log(
            'Recent Activity Error:',
            err.message
        );

        res.status(500).json({
            message:
                'Internal server error'
        });
    }
}

// MONTHLY ANALYTICS

async function getMonthlyAnalytics(req, res) {

    try {

        const monthlyData =
            await transactionModel.aggregate([
                {
                    $match: {
                        userId:
                            req.user.id
                    }
                },
                {
                    $group: {
                        _id: {
                            month: {
                                $month:
                                    '$createdAt'
                            }
                        },
                        totalTransactions: {
                            $sum: 1
                        },
                        fraudTransactions: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            '$prediction',
                                            'Fraud'
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $sort: {
                        '_id.month': 1
                    }
                }
            ]);

        res.status(200).json({
            monthlyData
        });

    } catch (err) {

        console.log(
            'Monthly Analytics Error:',
            err.message
        );

        res.status(500).json({
            message:
                'Internal server error'
        });
    }
}

// RISK DISTRIBUTION

async function getRiskDistribution(req, res) {

    try {

        const lowRisk =
            await transactionModel.countDocuments({
                userId: req.user.id,
                riskScore: {
                    $lte: 30
                }
            });

        const mediumRisk =
            await transactionModel.countDocuments({
                userId: req.user.id,
                riskScore: {
                    $gt: 30,
                    $lte: 70
                }
            });

        const highRisk =
            await transactionModel.countDocuments({
                userId: req.user.id,
                riskScore: {
                    $gt: 70
                }
            });

        res.status(200).json({
            lowRisk,
            mediumRisk,
            highRisk
        });

    } catch (err) {

        console.log(
            'Risk Distribution Error:',
            err.message
        );

        res.status(500).json({
            message:
                'Internal server error'
        });
    }
}

module.exports = {
    getDashboardStats,
    getRecentActivity,
    getMonthlyAnalytics,
    getRiskDistribution
};