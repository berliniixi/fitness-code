const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // check headers
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      errors: ["Authorization header is missing or invalid."],
    });
  }

  const token = authHeaders.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById({ _id: payload.userId });

    req.user = {
      userId: payload.userId,
      username: user.name,
      surname: user.surname,
      issuedAt: payload.iat,
      expiredAt: payload.exp,
    };
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      errors: ["Invalid Authentication."],
    });
  }

  next();
};

module.exports = auth;
