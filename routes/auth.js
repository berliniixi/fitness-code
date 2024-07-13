const express = require("express");
const { createRateLimiter } = require("../middleware/requestLimiter");
const router = express.Router();

const requestResetPasswordLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1,
  keyGenerator: (req) => req.body.email,
  message: "Too many requests, please try again later here.",
});

const {
  signUp,
  signIn,
  requestResetPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post(
  "/request-reset-password",
  requestResetPasswordLimiter,
  requestResetPassword
);
router.post("/reset-password", resetPassword);
module.exports = router;
