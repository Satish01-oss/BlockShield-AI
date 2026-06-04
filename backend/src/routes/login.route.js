const express = require('express');
const { login , googleLogin } = require('../controllers/login.controller');

const router = express.Router();

router.post('/login', login);
router.post('/google', googleLogin);

module.exports = router;