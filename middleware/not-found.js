const { StatusCodes } = require("http-status-codes");

const notFound = (req, res, next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, message: "Not Found" });

  next();
};

module.exports = notFound;
