const { StatusCodes } = require("http-status-codes");

const isBookDatePresent = (req, res, next) => {
  try {
    if (!req.body.bookDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: [
          "Book date is required field.",
          "Please provide date you want to book a session.",
        ],
      });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
  next();
};

module.exports = isBookDatePresent;
