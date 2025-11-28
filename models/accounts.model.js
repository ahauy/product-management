const mongoose = require("mongoose");
// Giả sử hàm này trả về string
const generateRandomString = require("../helpers/admin/generate.js"); 

const accountSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: {type: String},
    email: { type: String, required: true, unique: true }, // Email không được trùng
    password: { type: String, required: true },
    phone: { type: String, required: true },
    // SỬA LỖI TOKEN TẠI ĐÂY:
    token: {
      type: String,
      default: () => generateRandomString.generateRandomString(20), // Dùng arrow function để tạo mới mỗi lần save
    },
    
    avatar: String,
    
    // Cải thiện Role (Nếu có bảng Roles riêng thì dùng ObjectId)
    roleId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Role", // Tên model Role (nếu bạn tạo sau này)
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"], // Chỉ cho phép 2 trạng thái này
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

const Accounts = mongoose.model("Accounts", accountSchema, "accounts");
module.exports = Accounts;