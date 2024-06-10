const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

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

const transporter = nodemailer.createTransport({
  service: "email",
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.ADMIN_EMAIL_PROVIDER,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
});

const requestResetPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: "Email is required field. Please provide an email.",
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, error: "User with this email does not exist" });
    }

    // Generate a secure token
    const token = await new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) reject(err);
        bcrypt.hash(user.email, salt, (err, hash) => {
          if (err) reject(err);
          resolve(hash);
        });
      });
    });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const mailOptions = {
      from: { name: "Fitness Code", address: process.env.ADMIN_EMAIL_PROVIDER },
      to: user.email,
      subject: "Request Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      https://${req.headers.host}/api/v1/auth/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        return res.status(500).json({ error: "Error sending email" });
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        message: [
          "Password reset email sent successfully.",
          "Token will be expired in 5 minutes.",
        ],
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  if (!req.body.token || !req.body.newPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, error: "Token and new password are required." });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Token has expired. Please request a new reset link.",
      });
    }

    // Update password and clear reset token
    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors });
    }
  }
};

module.exports = { signUp, signIn, requestResetPassword, resetPassword };
