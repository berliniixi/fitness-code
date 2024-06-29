const getStartAndEndDate = require("./getStartAndEndDate");

const getFirstAndLastDayOfWeek = (date) => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
  startOfWeek.setDate(diff);
  getStartAndEndDate(startOfWeek);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  getStartAndEndDate(endOfWeek);

  return { startOfWeek, endOfWeek };
};

module.exports = getFirstAndLastDayOfWeek;
