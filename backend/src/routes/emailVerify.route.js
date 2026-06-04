const express = require('express');
const { verifyEmail } = require('../controllers/verify.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { resendVerificationEmail } = require('../controllers/verify.controller');

const router = express.Router();

router.get('/verify-email/:token', verifyEmail);
router.post(
  '/resend-verification',
  resendVerificationEmail
)

module.exports = router;