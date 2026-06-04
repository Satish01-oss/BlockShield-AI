require('dotenv').config();
const app =  require('./src/app')
const connectDB = require('./src/db/db');

const PORT = process.env.PORT
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
})