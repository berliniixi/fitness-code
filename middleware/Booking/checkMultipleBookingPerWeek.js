const Calendar = require("../../models/Calendar");
const { StatusCodes } = require("http-status-codes");
const getFirstAndLastDayOfWeek = require("../../utils/dates/getFirstAndLastDayOfWeek");

const checkMultipleBookingsPerWeek = async (req, res, next) => {
  try {
    const { startOfWeek, endOfWeek } = getFirstAndLastDayOfWeek(
      req.body.bookDate
    );

    const bookingSessionId = req.params.id;

    const date = new Date(req.body.bookDate);

    const dayOfWeek = date.getDay();

    // Check if the booking is on Saturday or Sunday
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: [
          "Bookings on Saturdays and Sundays are not allowed.",
          "Please book session in working days.",
        ],
      });
    }

    const weeklyBookings = await Calendar.countDocuments({
      bookedBy: req.user.userId,
      bookDate: { $gte: startOfWeek, $lte: endOfWeek },
      _id: { $ne: bookingSessionId }, // Exclude the current booking session
    });

    if (weeklyBookings >= 3) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: [
          "You already booked 3 sessions for this week.",
          "Try book other sessions in the upcoming week",
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

module.exports = checkMultipleBookingsPerWeek;
