const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || 5000,

  MONGODB_URI: process.env.MONGODB_URI,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  CLIENT_URL:
    process.env.CLIENT_URL || "http://localhost:5173",

  EMAIL_HOST: process.env.EMAIL_HOST,

  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,

  EMAIL_USER: process.env.EMAIL_USER,

  EMAIL_PASS: process.env.EMAIL_PASS,

  EMAIL_FROM: process.env.EMAIL_FROM,
};