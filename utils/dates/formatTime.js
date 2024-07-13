const formattedTime = (time) => {
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

module.exports = formattedTime;
