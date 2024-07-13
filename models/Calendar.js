const mongoose = require("mongoose");
const formattedTime = require("../utils/dates/formatTime");
// DATE VALIDATION
const validateDate = [
  {
    validator: function (value) {
      return new Date(value) >= new Date();
    },
    message: "Booking a session must start from the current day and after.",
  },
];

// BOOK TIME VALIDATION
// Validator to check if time is in HH:00 format
const validateTimeFormat = (time) => {
  const timeRegex = /^([01]\d|2[0-3]):00$/;
  return timeRegex.test(time);
};

// Validator to check if time is between 07:00 and 19:00
const validateTimeRange = (time) => {
  const [hours] = time.split(":").map(Number);
  return hours >= 7 && hours <= 19;
};

// SURNAME VALIDATION
const minMessageLengthRegex = /.{3,}/; // At least 3 characters
const maxMessageLengthRegex = /^.{0,50}$/; // No longer that 50 characters
const messageRegex = /^[A-Za-z][A-Za-z .]*$/;
const validateMessage = [
  {
    validator: function (value) {
      return minMessageLengthRegex.test(value);
    },
    message: "Message must be at least 3 characters long.",
  },
  {
    validator: function (value) {
      return maxMessageLengthRegex.test(value);
    },
    message: "Message must not be longer that 50 characters.",
  },
  {
    validator: function (value) {
      return messageRegex.test(value);
    },
    message: "Invalid message format. Message must contain only letters.",
  },
];

const CalendarSchema = new mongoose.Schema(
  {
    bookDate: {
      type: Date,
      required: [true, "Start time is required field."],
      validate: validateDate,
    },
    bookStartAt: {
      type: String,
      required: [true, "Booking start time is a required field."],
      validate: [
        {
          validator: validateTimeFormat,
          message: "Start time must be in HH:00 format.",
        },
        {
          validator: validateTimeRange,
          message: "Book sessions start at 07:00 and finish at 19:00.",
        },
      ],
    },
    bookFinishAt: {
      type: String,
      validate: {
        validator: validateTimeFormat,
        message:
          "Finish time must be in HH:MM format and between 07:00 and 19:00.",
      },
    },
    message: {
      type: String,
      validate: validateMessage,
    },
    bookedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User", //which model we referencing, in our case because it created by user we set the "ref": 'User
      require: [true, "Please provide user."],
    },
  },
  { timestamps: true }
);

CalendarSchema.pre("save", async function () {
  const [hours, minutes] = this.bookStartAt.split(":").map(Number);
  const startDate = new Date(this.bookDate);
  startDate.setHours(hours, minutes, 0, 0);

  // Set bookFinishAt to one hour after bookStartAt
  const finishDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  this.bookFinishAt = formattedTime(finishDate);
});

module.exports = mongoose.model("Calendar", CalendarSchema);
