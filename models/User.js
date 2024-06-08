const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// NAME VALIDATION
const minNameLengthRegex = /.{3,}/; // At least 3 characters
const maxNameLengthRegex = /^.{0,25}$/; // No longer that 25 characters
const nameRegex = /^[A-Za-z]+$/; // Only letters, spaces, and hyphens

const validateName = [
  {
    validator: function (value) {
      return minNameLengthRegex.test(value);
    },
    message: "Name must be at least 3 characters long.",
  },
  {
    validator: function (value) {
      return maxNameLengthRegex.test(value);
    },
    message: "Name must not be longer that 25 characters.",
  },
  {
    validator: function (value) {
      return nameRegex.test(value);
    },
    message: "Invalid name format. Name must contain only letters.",
  },
];

// SURNAME VALIDATION
const minSurnameLengthRegex = /.{3,}/; // At least 3 characters
const maxSurnameLengthRegex = /^.{0,25}$/; // No longer that 25 characters
const surnameRegex = /^[A-Za-z]+$/; // Only letters, spaces, and hyphens

const validateSurname = [
  {
    validator: function (value) {
      return minSurnameLengthRegex.test(value);
    },
    message: "Surname must be at least 3 characters long.",
  },
  {
    validator: function (value) {
      return maxSurnameLengthRegex.test(value);
    },
    message: "Surname must not be longer that 25 characters.",
  },
  {
    validator: function (value) {
      return surnameRegex.test(value);
    },
    message: "Invalid surname format. Surname must contain only letters.",
  },
];

// PHONE VALIDATION
const phoneNumberRegex = /^[0-9]{8}$/;
const noLettersRegex = /^[^A-Za-z]+$/; // Matches strings with no alphabetic characters
const validatePhone = [
  {
    validator: function (value) {
      return noLettersRegex.test(value);
    },
    message:
      "Invalid phone number format. Field must not contain any alphabetic characters.",
  },
  {
    validator: function (value) {
      return phoneNumberRegex.test(value);
    },
    message: "Invalid phone number format. Phone number must be 8 digit",
  },
];

// PASSWORD VALIDATION
// Regular expressions for password validation
const minLengthRegex = /.{8,}/; // At least 8 characters
const capitalLetterRegex = /[A-Z]/; // At least one capital letter
const specialCharacterRegex = /[!@#$%^&*()_+]/; // At least one special character

const validatePassword = [
  {
    validator: function (value) {
      return minLengthRegex.test(value);
    },
    message: "Password must be at least 8 characters",
  },
  {
    validator: function (value) {
      return capitalLetterRegex.test(value);
    },
    message: "Password must contain at least one capital letter",
  },
  {
    validator: function (value) {
      return specialCharacterRegex.test(value);
    },
    message:
      "Password must contain at least one special character (!,@,#,$,%,^,&,*,(,))",
  },
];

// EMAIL VALIDATION
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const noCapitalizeEmailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

const validateEmail = [
  {
    validator: function (value) {
      return emailRegex.test(value);
    },
    message: "Invalid email address. Please provide a legit email address.",
  },
  {
    validator: function (value) {
      return noCapitalizeEmailRegex.test(value);
    },
    message:
      "Invalid email address format. Email should not contain capital letters.",
  },
];

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      lowercase: true,
      validate: validateName,
    },
    surname: {
      type: String,
      required: [true, "Surname is required."],
      trim: true,
      lowercase: true,
      validate: validateSurname,
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone is required."],
      validate: validatePhone,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
      validate: validatePassword,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      validate: validateEmail,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  this.name = validator.trim(this.name);
  this.surname = validator.trim(this.surname);
  this.email = validator.trim(this.email);
  this.phone = validator.trim(this.phone);

  if (this.email && this.email.includes("@gmail.com")) {
    this.email = validator.normalizeEmail(this.email, {
      gmail_remove_dots: false,
    });
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
