const Calendar = require("../../models/Calendar");
const { StatusCodes } = require("http-status-codes");

const checkMultipleBookingsPerHour = async (req, res, next) => {

  try {
    const bookSessionPerHourCount = await Calendar.countDocuments({
      bookDate: { $eq: req.body.bookDate },
      bookStartAt: { $eq: req.body.bookStartAt },
    });

    if (bookSessionPerHourCount >= 2) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: [
          `Maximum number of bookings reached for ${req.body.bookStartAt}`,
          "Try booking a session at a different time.",
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
