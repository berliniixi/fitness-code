const { rateLimit } = require("express-rate-limit");

const createRateLimiter = ({ windowMs, max, keyGenerator, handler }) => {
  return rateLimit({
    windowMs, // when the next request will be take place
    max, // maximum number of request
    keyGenerator, // factor for blocking request
    handler: handler,
  });
};

module.exports = createRateLimiter;
