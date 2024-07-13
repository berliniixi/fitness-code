const Calendar = require("../../models/Calendar");
const { StatusCodes } = require("http-status-codes");
const formattedDate = require("../../utils/dates/formatDate");
const getStartAndEndDate = require("../../utils/dates/getStartAndEndDate");

const checkMultipleBookingsPerUser = async (req, res, next) => {
  try {
    const { startOfDay, endOfDay } = getStartAndEndDate(req.body.bookDate);

    // check user if it's book more than one time at day
    const isUserBooked = await Calendar.findOne({
      bookedBy: req.user.userId,
      bookDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (isUserBooked) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: [
          `You already booked a session for ${formattedDate(
            isUserBooked.bookDate
          )}`,
          `Your session starts at ${isUserBooked.bookStartAt}`,
          "User can't have more than one session booked at day.",
        ],
      });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
  next();
};

module.exports = checkMultipleBookingsPerUser;
