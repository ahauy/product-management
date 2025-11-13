// config/cloudinary.config.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config(); // đọc file .env

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

module.exports = cloudinary;
