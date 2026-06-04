const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, token) => {

    const verificationLink =
        `${process.env.CLIENT_URL}/verify-email/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your BlockShield AI Account",
        html: `
            <h2>Welcome to BlockShield AI</h2>

            <p>
                Click the button below to verify your account:
            </p>

            <a href="${verificationLink}">
                Verify Account
            </a>
        `
    });
};

const sendResetPasswordEmail =
    async (email, token) => {

        const resetLink =
            `${process.env.CLIENT_URL}/reset-password/${token}`;

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "Reset Your Password",

            html: `
            <h2>Password Reset</h2>

            <p>
                Click below to reset your password:
            </p>

            <a href="${resetLink}">
                Reset Password
            </a>
        `
        });
    };

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail
};