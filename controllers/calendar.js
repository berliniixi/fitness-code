const Calendar = require("../models/Calendar");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const formattedTime = require("../utils/dates/formatTime");
const getBookedSessions = require("../utils/findBookedSessionPerUser");

const bookSession = async (req, res) => {
  const userId = req.user.userId; // Assuming user is authenticated and user ID is available in req.user

  try {
    // Create booking
    const booking = new Calendar({
      bookDate: new Date(req.body.bookDate),
      bookStartAt: req.body.bookStartAt,
      message: req.body.message,
      bookedBy: userId,
    });

    await booking.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Session booked successfully.",
      booking,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors: errors });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error });
  }
};

const updateBookedSession = async (req, res) => {
  const userId = req.user.userId; // Assuming user is authenticated and user ID is available in req.user
  const bookingSessionId = req.params.id;

  // Compute bookFinishAt as one hour after bookStartAt
  const [hours, minutes] = req.body.bookStartAt.split(":").map(Number);
  const startDate = new Date(req.body.bookDate);
  startDate.setHours(hours, minutes, 0, 0);

  // Set bookFinishAt to one hour after bookStartAt
  const finishDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  req.body.bookFinishAt = formattedTime(finishDate);

  try {
    const updatedBooking = await Calendar.findByIdAndUpdate(
      { _id: bookingSessionId, bookedBy: userId },
      { ...req.body, bookFinishAt: req.body.bookFinishAt },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      res
        .status(StatusCodes.OK)
        .json({ success: false, error: ["There is not booked session"] });
    }

    res.status(StatusCodes.OK).json({ success: true, updatedBooking });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors: errors });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error });
  }
};

const deleteBookedSession = async (req, res) => {
  const bookingSessionId = req.params.id;
  const userId = req.user.userId; // Assuming user ID is stored in req.user

  try {
    const existingBooking = await Calendar.findOne({ _id: bookingSessionId });

    if (!existingBooking) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, error: ["Couldn't find the booked session"] });
    }

    // Check if the user making the request is the same as the one who created the booking
    if (existingBooking.bookedBy.toString() !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        error: ["You are not authorized to delete this booking"],
      });
    }

    await Calendar.findOneAndDelete({
      _id: bookingSessionId,
      bookedBy: userId,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Booked Session at ${
        existingBooking.bookDate.toISOString().split("T")[0]
      } ${existingBooking.bookStartAt} deleted successfully.`,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, errors: errors });
    }

    if (error.name === "CastError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: [
          `Couldn't find such booked session with id '${bookingSessionId}'.`,
        ],
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error });
  }
};

const getAllBookedSessions = async (req, res) => {
  try {
    const bookedSessions = await Calendar.find().sort("bookDate");
    return res.status(StatusCodes.OK).json({
      success: true,
      bookedSessions,
      length: bookedSessions.length,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error });
  }
};

const getByUserBookedSessions = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    const userBookedSessions = await getBookedSessions(req.params.userId);


    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: ["User does not exists"],
      });
    }

    if (!userBookedSessions) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: ["Requested users booked sessions couldn't be found."],
        length: userBookedSessions.length,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      userBookedSessions,
      length: userBookedSessions.length,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        errors: [`Couldn't find such an ${req.params.userId}.`],
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error });
  }
};

module.exports = {
  bookSession,
  updateBookedSession,
  deleteBookedSession,
  getAllBookedSessions,
  getByUserBookedSessions,
};
