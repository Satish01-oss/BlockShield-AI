const axios = require('axios');

async function predictFraud(data) {

    try {

        const response = await axios.post(
            process.env.PYTHON_API_URL,
            data
        );

        return response.data;

    } catch (err) {

        console.log(
            'ML Service Error:',
            err.message
        );

        throw err;
    }
}

module.exports = {
    predictFraud
};