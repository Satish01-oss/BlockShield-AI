const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const adminRoutes = require('./routes/admin.route');
const analyticsRoutes = require('./routes/analytics.route');
const tempRoutes = require('./routes/temp.route');
const emailVerificationRoutes = require('./routes/emailVerify.route');
const forgotPasswordRoutes = require('./routes/forgotPassword.route');
const loginRoutes = require('./routes/login.route');
const registerRoutes = require('./routes/register.route');
const resetPasswordRoutes = require('./routes/resetPassword.route');
const userRoutes = require('./routes/user.route');
const fraud = require('./routes/fraud.route');
const transactionRoutes = require('./routes/transaction.route');

const app = express();
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/temp', tempRoutes);
app.use('/api/emailVerification', emailVerificationRoutes);
app.use('/api/forgotPassword', forgotPasswordRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/resetPassword', resetPasswordRoutes);
app.use('/api/user', userRoutes);
app.use('/api/fraud', fraud);
app.use('/api/transaction', transactionRoutes);

module.exports = app;