const { rateLimit } = require("express-rate-limit");
const { StatusCodes } = require("http-status-codes");

const reqPassLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1, // limit each IP to 100 requests per window,
  keyGenerator: (req) => req.body.email, // Rate limit based on email
  handler: async (req, res, next) => {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message: "Too many requests, please try again in 5 minutes.",
    });
  },
});

module.exports = { reqPassLimiter };
