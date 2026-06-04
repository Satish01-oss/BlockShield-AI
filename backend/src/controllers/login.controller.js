const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    OAuth2Client
} = require('google-auth-library')

const client =
    new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID
    )

const axios = require('axios')

async function googleLogin(req, res) {

    try {

        const { access_token } = req.body;

        const googleResponse =
            await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
            );

        const {
            email,
            name
        } = googleResponse.data;

        let user =
            await userModel.findOne({ email });

        if (user.isBlocked) {
            return res.status(403).json({

                message:
                    'Your account has been blocked by admin'

            })
        }
        if (!user) {

            user =
                await userModel.create({

                    userName:
                        `${name}`,

                    email,

                    password:
                        'google-auth-user-secure-password',

                    isVerified: true

                });
        }


        const token =
            jwt.sign(

                {
                    id: user._id,
                    role: user.role
                },

                process.env.SECRET_KEY,

                {
                    expiresIn: '7d'
                }

            );

        res.status(200).json({

            message:
                'Google login successful',

            token,

            user

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message:
                'Google authentication failed'

        });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({

                message:
                    'Your account has been blocked by admin'

            })
        }

        if (!user.isVerified) {

            return res.status(403).json({

                message:
                    'Please verify your email',

                showResend: true

            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user:
            {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.log("Login Error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { login, googleLogin };