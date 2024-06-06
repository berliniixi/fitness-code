const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const signUp = async (req, res) => {
  try {
    const storedUserInfo = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    }).exec();

    if (storedUserInfo) {
      const messages = [];
      if (storedUserInfo.email === req.body.email) {
        messages.push(`User with email '${req.body.email}' already exists.`);
      }
      if (storedUserInfo.phone === req.body.phone) {
        messages.push(`User with phone '${req.body.phone}' already exists.`);
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: messages,
      });
    }

    const user = await User.create({
      success: true,
      ...req.body,
    });
    res.status(StatusCodes.CREATED).json({ user });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false , errors});
    }
  }
};

const signIn = async (req, res) => {};

module.exports = { signUp, signIn };
