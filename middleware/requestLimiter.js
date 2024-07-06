const { rateLimit } = require("express-rate-limit");
const { StatusCodes } = require("http-status-codes");

const createRateLimiter = ({ windowMs, max, keyGenerator }) => {
  return rateLimit({
    windowMs, // when the next request will be take place
    max, // maximum number of request 
    keyGenerator, // 
    handler: (req, res) => {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        success: false,
        message: "Too many requests, please try again later.",
      });
    },
  });
};

module.exports = { createRateLimiter };
