const axios = require('axios')

const transactionModel =
    require('../models/transaction.model')

// ============================================
// ANALYZE TRANSACTION
// ============================================

const analyzeTransaction =
    async (req, res) => {

        try {

            const {
                walletAddress
            } = req.body

            if (!walletAddress) {

                return res.status(400).json({

                    message:
                        'Wallet address is required'

                })
            }

            // ====================================
            // SEND DEMO DATA TO PYTHON AI
            // ====================================

            const pythonResponse =
                await axios.post(

                    `${process.env.PYTHON_API_URL}/predict`,

                    {

                        tx_value_eth:
                            Math.random() * 20,

                        gas_price_gwei:
                            Math.random() * 300,

                        account_age_days:
                            Math.random() * 100

                    }
                )

            // ====================================
            // GET PYTHON RESULT
            // ====================================

            const aiData =
                pythonResponse.data

            // ====================================
            // FORMAT RESULT
            // ====================================

            const prediction =

                aiData.is_fraud === 1

                    ? 'Fraud'

                    : 'Safe'

            const confidence = Math.round(

                aiData.fraud_probability * 100

            )

            const riskScore = confidence

            // ====================================
            // SAVE TRANSACTION
            // ====================================

            const transaction =
                await transactionModel.create({

                    userId: req.user.id,

                    walletAddress,

                    transactionHash:
                        `TX-${Date.now()}`,

                    prediction,

                    confidence,

                    riskScore

                })

            // ====================================
            // RESPONSE
            // ====================================

            res.status(200).json({

                message:
                    'Analysis completed successfully',

                transaction

            })

        } catch (err) {

            console.log(
                'Fraud Detection Error:',
                err.message
            )

            res.status(500).json({

                message:
                    'Fraud analysis failed'

            })
        }
    }

module.exports = {
    analyzeTransaction
}