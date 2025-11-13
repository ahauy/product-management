// config/multer.config.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary.config');

// Cấu hình nơi lưu trữ trên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'MyClothes', // Tên folder lưu ảnh trên Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });
module.exports = upload;
