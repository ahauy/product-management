const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, slug: "title", unique: true },

    // Lời mở cho bài viết - thường là câu hỏi?
    description: { type: String, default: "" },

    // Nội dung chính của bài viết
    detail: { type: String, default: "" },

    // Một bài viết có thể thuộc 1 hoặc nhiều danh mục khác nhau
    blog_category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
    }],

    // Ảnh nổi bật
    thumbnail: { type: String },

    // Quản lý hiển thị
    tags: [{ type: String }],

    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },

    // --- MỚI THÊM: Bài viết nổi bật ---
    featured: {
      type: Boolean,
      default: false, // Mặc định là false (không nổi bật)
    },
    
    position: { type: Number, default: 0 },

    // Google tìm kiếm thường hiển thị title và description khác với nội dung trên trang
    meta_title: { type: String, trim: true }, // Tiêu đề hiển thị trên Google
    meta_description: { type: String, trim: true }, // Mô tả hiển thị trên Google
    meta_keywords: { type: String }, // Từ khóa (tùy chọn)

    // Lượt xem bài viết
    views: {
      type: Number,
      default: 0
    },

    // Ngày xuất bản (Quan trọng)
    // createdAt là ngày bạn "tạo nháp". publishedAt là ngày bài viết "xuất hiện" với người đọc.
    // Dùng để lập lịch đăng bài (Schedule Post).
    publishedAt: {
      type: Date,
      default: null // Khi nào chuyển status sang 'active' thì cập nhật trường này
    },

    // nguời tạo
    createdBy: {
      accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accounts",
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },

    // người chỉnh SỬA
    updatedBy: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Accounts",
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // người xoá
    deletedBy: {
      accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accounts",
      },
      deletedAt: {
        type: Date,
        default: Date.now
      }
    },

    // Xóa mềm
    deleted: { type: Boolean, default: false },
    
  },
  { timestamps: true }
);

// Đánh index
blogSchema.index({slug: 1})
blogSchema.index({deleted: 1, status: 1})
blogSchema.index({blog_category: 1, createAt: -1})

const Blog = mongoose.model("Blog", blogSchema, "blog");
module.exports = Blog;

