const mongoose = require("mongoose");
// const validator = require("validator");

// DATE VALIDATION 
// const validateDate = [
//   {
//     validator: function (value) {
//       return this.startAt = validator.isDate(value)
//     }
//   }
// ]



// SURNAME VALIDATION
const minMessageLengthRegex = /.{3,}/; // At least 3 characters
const maxMessageLengthRegex = /^.{0,25}$/; // No longer that 25 characters
const messageRegex = /^[A-Za-z]+$/; // Only letters, spaces, and hyphens

const validateMessage = [
  {
    validator: function (value) {
      return minMessageLengthRegex.test(value);
    },
    message: "Surname must be at least 3 characters long.",
  },
  {
    validator: function (value) {
      return maxMessageLengthRegex.test(value);
    },
    message: "Surname must not be longer that 25 characters.",
  },
  {
    validator: function (value) {
      return messageRegex.test(value);
    },
    message: "Invalid surname format. Surname must contain only letters.",
  },
];

const CalendarSchema = new mongoose.Schema(
  {
    startAt: {
      type: Date,
      required: [true, "Start time is required field."],
    },
    finishedAt: {
      type: Date,
      required: [true, "Finished time is required field."],
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

// CalendarSchema.pre('save' , async function () {
//     const isStartAtDate = validator.isDate(this.startAt)
//     const isFinishedAtDate = validator.isDate(this.finishedAt)
//     this.message = validator.trim(this.message)

//     if (!isStartAtDate) {

//     }
// })

module.exports = mongoose.model("Calendar", CalendarSchema);
