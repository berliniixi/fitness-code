const Calendar = require("../../models/Calendar");
const { StatusCodes } = require("http-status-codes");

const checkMultipleBookingsPerHour = async (req, res, next) => {
  try {
    const bookSessionPerHourCount = await Calendar.countDocuments({
      bookDate: { $eq: req.body.bookDate },
      bookStartAt: { $eq: req.body.bookStartAt },
    });

    // bookSessionPerHourCount must became 5
    if (bookSessionPerHourCount >= 3) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: [
          `Maximum number of bookings reached for ${req.body.bookStartAt} on ${req.body.bookDate}`,
          "Try booking a session at a different date or time.",
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

module.exports = checkMultipleBookingsPerHour;
