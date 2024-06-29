const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // check headers
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication invalid.",
    });
  }

  const token = authHeaders.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication invalid.",
    });
  }

  next();
};

module.exports = auth;
