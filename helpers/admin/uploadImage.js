const cloudinary = require("../../config/cloudinary.config");
const fs = require("fs");

module.exports = async (input) => {
  // 1. Kiểm tra đầu vào: Nếu là mảng thì giữ nguyên, nếu là object thì nhét vào mảng
  // Dòng này giúp code bên dưới luôn chạy đúng dù input là 1 file hay nhiều file
  const files = Array.isArray(input) ? input : [input];

  try {
    // 2. Upload song song (Logic cũ của bạn)
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "uploads" })
    );

    const results = await Promise.all(uploadPromises);

    // 3. Lấy URL
    const urls = results.map((result) => result.secure_url);

    // 4. Trả về kết quả thông minh
    // Nếu đầu vào là mảng -> Trả về mảng các URL
    // Nếu đầu vào là 1 file -> Trả về đúng 1 đường link string (cho tiện lưu DB)
    return Array.isArray(input) ? urls : urls[0];

  } finally {
    // 5. Dọn dẹp file local (Đặt trong finally để dù upload lỗi vẫn xóa rác)
    // Kiểm tra file tồn tại trước khi xóa để tránh lỗi
    files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
};