const cloudinary = require("../../config/cloudinary.config");
const fs = require("fs");

module.exports = async (files) => {
  // Upload song song
  const uploadPromises = files.map((file) =>
    cloudinary.uploader.upload(file.path, { folder: "uploads" })
  );

  const results = await Promise.all(uploadPromises);

  // Xóa file local sau khi upload xong
  files.forEach((file) => fs.unlinkSync(file.path));

  // Lấy URL từ kết quả
  const urls = results.map((result) => result.secure_url);

  return urls;
}