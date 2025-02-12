const redis = require("redis");
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
});

client.on("error", (err) => console.error("Redis Error:", err));

client.on("connect", () => console.error("Redis Client Connected"));

module.exports = client;
