const express = require("express");
const router = express.Router();

const {
  bookSession,
  updateBookedSession,
  deleteBookedSession,
  getAllBookedSessions,
  getByUserBookedSessions,
} = require("../controllers/calendar");
const isUserActive = require("../middleware/Booking/checkUserActivation");
const isBookDatePresent = require("../middleware/Booking/checkBookDate");
const checkMultipleBookingsPerUser = require("../middleware/Booking/checkMultipleBookingsPerUser");
const checkMultipleBookingsPerWeek = require("../middleware/Booking/checkMultipleBookingPerWeek");
const checkMultipleBookingsPerHour = require("../middleware/Booking/checkMultipleBookingsPerHour");
const isUpdatingTheSameSession = require("../middleware/Booking/checkUpdateBookSession");

// create
router.post(
  "/create",
  [
    isUserActive,
    isBookDatePresent,
    checkMultipleBookingsPerUser,
    checkMultipleBookingsPerHour,
    checkMultipleBookingsPerWeek,
  ],
  bookSession
);

// update - modified
router.patch(
  "/update/:id",
  [
    isUserActive,
    isBookDatePresent,
    isUpdatingTheSameSession,
    // checkMultipleBookingsPerUser,
    checkMultipleBookingsPerHour,
    checkMultipleBookingsPerWeek,
  ],
  updateBookedSession
);
// delete
router.delete("/delete/:id", deleteBookedSession);

// Get all booked sessions from all users
router.get("/get-all", getAllBookedSessions);

// Get all booked sessions from a user
router.get("/get-all/:userId", getByUserBookedSessions);
module.exports = router;
