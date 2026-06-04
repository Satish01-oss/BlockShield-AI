const crypto = require("crypto");
const userModel = require("../models/user.model");
const { sendResetPasswordEmail } = require("../services/email.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function forgotPassword(req, res) {

    const { email } = req.body;

    try {

        const user =
            await userModel.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken =
            crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpire =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendResetPasswordEmail(
            user.email,
            resetToken
        );

        res.status(200).json({
            message:
                "Password reset email sent"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message:
                "Internal server error"
        });
    }
}

module.exports = {forgotPassword};