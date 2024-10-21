require("dotenv").config();
const redis = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = redis.createClient({ url: redisUrl });

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.connect().then(() => {
  console.log("Connected to Redis");
});

module.exports = redisClient;
