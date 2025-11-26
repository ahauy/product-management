const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater"); // Sử dụng lại plugin slug bạn đã cài

mongoose.plugin(slug);

const roleSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true // Bắt buộc phải có tên
    },
    
    // Thêm slug để URL đẹp hơn và dễ query
    slug: { 
      type: String, 
      slug: "title", 
      unique: true 
    },

    description: String,

    // Cải thiện permissions: Chỉ chứa mảng các chuỗi String
    permissions: {
      type: [String], 
      default: [],
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

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;