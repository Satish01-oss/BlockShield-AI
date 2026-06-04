const express = require('express');
const { resetPassword } = require('../controllers/resetPassword.controller');

const router = express.Router();

router.post('/reset-password/:token', resetPassword);

module.exports = router;