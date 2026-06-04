const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const {
  sendVerificationEmail
} = require(
  '../services/email.service'
)

async function verifyEmail(req, res) {

    const { token } = req.params;

    try {

        const user =
            await userModel.findOne({

                verificationToken: token

            });

        // TOKEN INVALID

        if (!user) {

            return res.status(400).json({

                message:
                    'Invalid or expired token',

                showResend: true

            });
        }

        // ALREADY VERIFIED

        if (user.isVerified) {

            return res.status(400).json({

                message:
                    'Email already verified'

            });
        }

        // VERIFY USER

        user.isVerified = true;

        user.verificationToken = null;

        await user.save();

        res.status(200).json({

            message:
                'Email verified successfully'

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message:
                'Internal server error'

        });
    }
}

async function resendVerificationEmail(
    req,
    res
) {

    const { email } = req.body

    try {

        const user =
            await userModel.findOne({
                email
            })

        if (!user) {

            return res.status(404).json({

                message:
                    'User not found'

            })
        }

        if (user.isVerified) {

            return res.status(400).json({

                message:
                    'Email already verified'

            })
        }

        // NEW TOKEN

        const verificationToken =
            crypto.randomBytes(32)
                .toString('hex')

        user.verificationToken =
            verificationToken

        await user.save()

        // SEND EMAIL AGAIN

        const verifyLink =
            `${process.env.CLIENT_URL}/verify-email/${verificationToken}`

        await sendVerificationEmail(

            user.email,

            'Verify Your Email',

            `
            Click this link to verify:

            ${verifyLink}
            `
        )

        res.status(200).json({

            message:
                'Verification email resent successfully'

        })

    } catch (err) {

        console.log(err)

        res.status(500).json({

            message:
                'Internal server error'

        })
    }
}

module.exports = {
    verifyEmail,
    resendVerificationEmail
};