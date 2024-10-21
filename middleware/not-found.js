const { StatusCodes } = require("http-status-codes");

const notFound = (req, res, next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, errors: ["Not Found"] });

  next();
};

module.exports = notFound;
