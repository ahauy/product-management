const express = require('express')
const routes = express.Router()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('../../config/cloudinary.config')

// upload ảnh trong tinymce
routes.post('/tinymce', upload.single('file'), async (req, res) => {
  try {
    // [Thêm dòng này để debug] Kiểm tra xem file có tồn tại không
    // console.log("File received:", req.file); 
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "tinymce",
    });

    res.json({
      location: result.secure_url
    });

  } catch (error) {
    // console.log("Lỗi upload tinymce:", error); // Log lỗi chi tiết ra terminal
    res.status(500).json({ error: "Upload failed" });
  }
})

module.exports = routes