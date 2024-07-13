const formattedDate = (date) => {

  // Get the year, month, and day components separately
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-based, so add 1
  const day = date.getDate();

  // Construct the date string in the desired format (DD-MM-YYYY)
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
  // const formattedTime = `${hours}:${minutes}:${seconds}`;
  const dayTime = `${formattedDate}`;

  return dayTime;
};

module.exports = formattedDate;
