require("dotenv").config();
const axios = require("axios");
const redisClient = require("../redisClient");
const { StatusCodes } = require("http-status-codes");

const fetchAndCacheData = async (req, res) => {
  try {
    const limit = req.query.limit;
    const offset = req.query.offset;

    const cacheKey = `externalData:${req.endpoint}:${limit || "no-limit"}:${
      offset || "no-offset"
    }`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Serving from Redis cache");
      return res.json({
        success: true,
        data: JSON.parse(cachedData),
        length: JSON.parse(cachedData).length,
      });
    }

    const response = await axios.get(
      `${process.env.EXERCISE_ENDPOINT}/${req.endpoint}`,
      {
        headers: {
          "x-rapidapi-key": process.env.EXERCISE_API_KEY,
          "x-rapidapi-host": process.env.EXERCISE_HEADER,
        },
        params: {
          limit: limit || undefined,
          offset: offset || undefined,
        },
      }
    );

    const data = response.data;

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(data)); // Cache for 1 hour
    res.json({ success: true, data, length: data.length });
  } catch (error) {
    // console.error("Error fetching data:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, errors: error.message });
  }
};

module.exports = fetchAndCacheData;
