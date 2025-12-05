const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Mã code để người dùng nhập (VD: SALE2024). Nếu để trống thì là khuyến mãi tự động.
    code: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true, // Tự động viết hoa
      sparse: true, // Cho phép nhiều document không có code (null) mà không bị lỗi duplicate
    },
    description: String,
    thumbnail: String,

    // Loại giảm giá: phần trăm hay số tiền
    discountType: {
      type: String,
      enum: ["percentage", "fixed_amount"],
      required: true,
      default: "percentage",
    },
    // Giá trị giảm (VD: 10 nếu là %, 50000 nếu là fixed)
    discountValue: {
      type: Number,
      required: true,
    },
    // Giảm tối đa bao nhiêu tiền (chỉ dùng khi discountType là percentage)
    maxDiscountAmount: {
      type: Number,
      default: null,
    },

    // Thời gian hiệu lực
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    // Phạm vi áp dụng
    scope: {
      type: String,
      enum: ["all", "category", "product"], // Toàn bộ, Theo danh mục, Theo sản phẩm
      default: "all",
    },
    // Nếu scope là 'category', mảng này chứa ID các danh mục được áp dụng
    appliedCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductsCategory", // Khớp với model name bạn đã gửi
      },
    ],
    // Nếu scope là 'product', mảng này chứa ID các sản phẩm được áp dụng
    appliedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Khớp với model name bạn đã gửi
      },
    ],

    // Điều kiện sử dụng
    minOrderValue: {
      type: Number,
      default: 0, // Đơn hàng phải từ bao nhiêu tiền mới được dùng
    },
    quantityLimit: {
      type: Number,
      default: 0, // 0 nghĩa là không giới hạn
    },
    usedQuantity: {
      type: Number,
      default: 0, // Đã sử dụng bao nhiêu lần
    },

    // Trạng thái
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Method kiểm tra xem khuyến mãi còn hiệu lực không
promotionSchema.methods.isValid = function () {
  const now = new Date();
  // Kiểm tra status, deleted
  if (this.status !== "active" || this.deleted) return false;
  // Kiểm tra thời gian
  if (now < this.startDate || now > this.endDate) return false;
  // Kiểm tra số lượng (nếu có giới hạn)
  if (this.quantityLimit > 0 && this.usedQuantity >= this.quantityLimit) return false;

  return true;
};

const Promotion = mongoose.model("Promotion", promotionSchema, "promotions");

module.exports = Promotion;