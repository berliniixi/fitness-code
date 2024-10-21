const User = require("../../models/User");
const { StatusCodes } = require("http-status-codes");

const isUserActive = async (req, res, next) => {
  const userId = req.user.userId; // Assuming user is authenticated and user ID is available in req.user

  // Check if user is active
  try {
    const user = await User.findById(userId);

    if (!user.active) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        errors: [
          "User is not activated. Please activate your user account to book a session.",
        ],
      });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errors: ["Something went wrong"] });
  }
  next();
};

module.exports = isUserActive;
