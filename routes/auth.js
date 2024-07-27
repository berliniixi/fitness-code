const express = require("express");
const createRateLimiter = require("../middleware/requestLimiter");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const requestResetPasswordLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1,
  keyGenerator: (req) => req.body.email,
  handler: (req, res) => {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message: "Too many requests, please try again in 5 minutes.",
    });
  },
});

const loginPasswordLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.body.email,
  handler: (req, res) => {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message: "Too many requests, please try again in 1 hour.",
    });
  },
});

const {
  signUp,
  signIn,
  requestResetPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/sign-up", signUp);
router.post("/sign-in", loginPasswordLimiter, signIn);
router.post(
  "/request-reset-password",
  requestResetPasswordLimiter,
  requestResetPassword
);
router.post("/reset-password", resetPassword);
module.exports = router;
