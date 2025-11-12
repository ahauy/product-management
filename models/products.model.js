const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, slug: "title", unique: true },

    description: { type: String, default: "" },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Giá & khuyến mãi
    price: { type: Number, required: true },
    currency: { type: String, default: "VND" },
    discountPercentage: { type: Number, default: 0 },
    salePrice: { type: Number },
    isOnSale: { type: Boolean, default: false },
    campaignTag: { type: String, trim: true },

    // Giới tính (nếu cần)
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },

    // Biến thể (size, màu sắc)
    variants: [
      {
        sku: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        stock: { type: Number, default: 0 },
        imageUrl: { type: String },
      },
    ],

    // Hình ảnh sản phẩm
    media: [
      {
        url: String,
        alt: String,
      },
    ],

    // Đánh giá / doanh số
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      salesCount: { type: Number, default: 0 },
    },

    // Quản lý hiển thị
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    position: { type: Number, default: 0 },

    // Xóa mềm
    deleted: { type: Boolean, default: false },
    deleteAt: Date,
  },
  { timestamps: true }
);

// Middleware: tự tính salePrice
productSchema.pre("save", function (next) {
  if (this.discountPercentage && this.price) {
    this.salePrice = this.price - (this.price * this.discountPercentage) / 100;
  } else {
    this.salePrice = this.price;
  }
  next();
});

const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;
