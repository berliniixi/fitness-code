const express = require("express");
const router = express.Router();

const { bookSession } = require("../controllers/calendar");
const checkMultipleBookingsPerUser = require("../middleware/Booking/checkMultipleBookingsPerUser");
const checkMultipleBookingsPerWeek = require("../middleware/Booking/checkMultipleBookingPerWeek");

router.post(
  "/create",
  [checkMultipleBookingsPerUser, checkMultipleBookingsPerWeek],
  bookSession
);
module.exports = router;
