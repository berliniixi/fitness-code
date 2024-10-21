const Calendar = require("../../models/Calendar");
const { StatusCodes } = require("http-status-codes");
const getBookedSessions = require("../../utils/findBookedSessionPerUser");
const areDatesEqualByDay = require("../../utils/dates/areDatesEqualByDay");
const areTimesEqual = require("../../utils/dates/areTimesEqual");

const isUpdatingTheSameSession = async (req, res, next) => {
  const bookingSessionId = req.params.id;
  const user = req.user; // Assuming user ID is stored in req.user

  try {
    // Fetch the existing booking from the database
    const existingBooking = await Calendar.findOne({ _id: bookingSessionId });
    const userBookedSessions = await getBookedSessions(user.userId);

    if (!existingBooking) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, errors: ["Booking not found"] });
    }

    // Check if the user making the request is the same as the one who created the booking
    if (existingBooking.bookedBy.userId.toString() !== user.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        errors: ["You are not authorized to update this booking"],
      });
    }

    // Compare the existing bookDate and bookStartAt with the values in the request body
    if (
      existingBooking.bookDate.toISOString().split("T")[0] ===
        req.body.bookDate &&
      existingBooking.bookStartAt === req.body.bookStartAt
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: [
          "You are attempting to update the booking with the same date and time.",
        ],
      });
    }

    // Check if the new bookDate already exists in the user's booked sessions
    const newBookDate = new Date(req.body.bookDate);
    for (let session of userBookedSessions) {
      if (
        areDatesEqualByDay(newBookDate, session.bookDate) &&
        !areTimesEqual(newBookDate, session.bookDate)
      ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          errors: [
            "You are attempting to update the booking to a day that already has a booked session.",
          ],
        });
      }
    }

    next();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, errors: [error.message] });
  }
};

module.exports = isUpdatingTheSameSession;
