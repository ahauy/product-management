const mongoose = require("mongoose");
const generateRandomString = require("../helpers/admin/generate.js"); 

const passwordForgotSchema = new mongoose.Schema(
  {
    email: { 
        type: String, 
        required: true, 
    },
    OTP: { 
        type: String, 
        required: true, 
        unique: true 
    },
    "expireAt": { 
      type: Date,  
      expires: 180
    } 
  },
  {
    timestamps: true,
  }
);

const PasswordForgot = mongoose.model("PasswordForgot", passwordForgotSchema, "password-forgot");
module.exports = PasswordForgot; // Đã sửa lỗi export Accounts