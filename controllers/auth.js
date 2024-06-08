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

    const token = user.createJWT();


    res.status(StatusCodes.CREATED).json({ success: true, token });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors });
    }
  }
};

const signIn = async (req, res) => {
  const messages = [];

  if (!req.body.email || !req.body.password) {
    if (!req.body.email) {
      messages.push("Email is a required field. Please provide an email.");
    }
    if (!req.body.password) {
      messages.push("Password is a required field. Please provide a password.");
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: messages,
    });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    messages.push("Invalid credential. User doesn't exists.");

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: messages,
    });
  }

  const isPasswordCorrect = await user.comparePassword(req.body.password);

  if (!isPasswordCorrect) {
    messages.push("Invalid credential. Password is invalid.");

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: messages,
    });
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    success: true,
    user: { id: user._id },
    token,
  });
};

module.exports = { signUp, signIn };
