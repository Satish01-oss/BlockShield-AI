const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
async function resetPassword(req, res) {

    const { token } = req.params;

    const { password } = req.body;

    try {
        console.log("Reset Password Token:", token);
        const user =
            await userModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpire: {
                    $gt: Date.now()
                }
            });

            console.log("User found for reset:", user);

        if (!user) {

            return res.status(400).json({
                message:
                    "Invalid or expired token"
            });
        }

        if (!password) {

            return res.status(400).json({
                message: "Password is required"
            });
        }

        const salt =
            await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        user.resetPasswordToken = null;

        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({
            message:
                "Password reset successful"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message:
                "Internal server error"
        });
    }
}

module.exports = { resetPassword };