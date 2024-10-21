const Calendar = require("../models/Calendar");
// Function that get all the booked session of user
const getBookedSessions = async (userId) => {
  try {
    const query = {
      "bookedBy.userId": { $eq: userId },
    };

    const bookedSessions = await Calendar.find(query);

    return bookedSessions;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = getBookedSessions;
