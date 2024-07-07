const express = require("express");
const router = express.Router();

const { bookSession } = require("../controllers/calendar");
// create
const isUserActive = require("../middleware/Booking/checkUserActivation");
const isBookDatePresent = require("../middleware/Booking/checkBookDate");
const checkMultipleBookingsPerUser = require("../middleware/Booking/checkMultipleBookingsPerUser");
const checkMultipleBookingsPerWeek = require("../middleware/Booking/checkMultipleBookingPerWeek");
const checkMultipleBookingsPerHour = require("../middleware/Booking/checkMultipleBookingsPerHour");
// update - modified

// delete
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
module.exports = router;
