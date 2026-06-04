const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
    sendVerificationEmail,
    sendResetPasswordEmail
} = require("../services/email.service");

async function register(req, res) {

    const {
        userName,
        email,
        password,
        role = "user"
    } = req.body;

    try {

        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(password, salt);

        const verificationToken =
            crypto.randomBytes(32).toString("hex");

        const newUser = await userModel.create({
            userName,
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            verificationToken
        });

        await sendVerificationEmail(
            newUser.email,
            verificationToken
        );

        const token = jwt.sign(
            {
                id: newUser._id,
                role: newUser.role
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "2h"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 2 * 60 * 60 * 1000
        });

        res.status(201).json({
            message:
                "User registered successfully. Please verify your email.",
            user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                role: newUser.role,
                isVerified: newUser.isVerified
            }
        });

    } catch (err) {

        console.log("Register Error:", err.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    register
};