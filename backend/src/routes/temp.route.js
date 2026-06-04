const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");


router.get('/test-email', async (req, res) => {

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: process.env.EMAIL_USER,

        subject: 'Test Email',

        text: 'Email working successfully'
    });

    res.send('Email sent');
});

module.exports = router;