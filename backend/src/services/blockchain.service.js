const axios = require('axios');

async function fetchTransactionData(
    walletAddress,
    transactionHash
) {

    try {

        const response = await axios.get(
            `https://api.etherscan.io/api`,
            {
                params: {
                    module: 'proxy',
                    action: 'eth_getTransactionByHash',
                    txhash: transactionHash,
                    apikey:
                        process.env.ETHERSCAN_API_KEY
                }
            }
        );

        const tx = response.data.result;

        if (!tx) {
            throw new Error(
                'Transaction not found'
            );
        }

        return {
            walletAddress,
            transactionHash,
            from: tx.from,
            to: tx.to,
            value: parseInt(tx.value, 16),
            gas: parseInt(tx.gas, 16),
            gasPrice: parseInt(tx.gasPrice, 16)
        };

    } catch (err) {

        console.log(
            'Blockchain Service Error:',
            err.message
        );

        throw err;
    }
}

module.exports = {
    fetchTransactionData
};