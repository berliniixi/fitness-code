const formattedDate = (date) => {

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Get the year, month, and day components separately
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-based, so add 1
  const day = date.getDate();

  // Construct the date string in the desired format (DD-MM-YYYY)
  const formattedDate = `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  const dayTime = `${formattedDate} - ${formattedTime}`;

  return dayTime;

};

module.exports = { formattedDate };
