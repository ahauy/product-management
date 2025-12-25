const mongoose = require("mongoose");
const generateRandomString = require("../helpers/admin/generate.js"); 

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String },
    
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { type: String, required: true },
    phone: { type: String }, // SĐT chính của tài khoản

    // --- PHẦN MỚI THÊM: DANH SÁCH ĐỊA CHỈ ---
    addresses: [
      {
        name: { type: String },   // Tên người nhận hàng
        phone: { type: String },  // SĐT nhận hàng
        province: { type: String }, // Tỉnh/Thành
        district: { type: String }, // Quận/Huyện
        ward: { type: String },     // Phường/Xã
        detail: { type: String },   // Số nhà, đường...
        isDefault: { 
            type: Boolean, 
            default: false 
        } 
      }
    ],
    // ----------------------------------------

    tokenUser: {
      type: String,
      default: () => generateRandomString.generateRandomString(20),
    },
    
    avatar: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");
module.exports = User; // Đã sửa lỗi export Accounts