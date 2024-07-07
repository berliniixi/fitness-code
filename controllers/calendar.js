const Calendar = require("../models/Calendar");
// const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const bookSession = async (req, res) => {
  const userId = req.user.userId; // Assuming user is authenticated and user ID is available in req.user

  try {
    // Check if the user is already book a session for today

    // Check if the user has already booked 3 times in the same week
    // const oneWeekAgo = new Date();
    // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // const userBookings = await Calendar.countDocuments({
    //   bookedBy: userId,
    //   bookDate: { $gte: oneWeekAgo },
    // });

    // if (userBookings >= 3) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     success: false,
    //     message: "You have already booked 3 sessions this week.",
    //   });
    // }

    // // Check if there are already 5 bookings for the given hour
    // const start = new Date(bookDate);
    // const end = new Date(bookDate);
    // end.setHours(end.getHours() + 1); // session duration is 1 hour

    // const overlappingBookings = await Calendar.countDocuments({
    //   bookDate: { $lt: end },
    // });

    // if (overlappingBookings >= 5) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     success: false,
    //     message: "This time slot is fully booked. Please choose another time.",
    //   });
    // }

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
    console.log(error);
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

const updateBookedSession = async (req, res) => {};

const deleteBookedSession = async (req, res) => {};

module.exports = { bookSession };
