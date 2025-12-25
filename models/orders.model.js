const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {

    code: {
      type: String,
      required: true,
      unique: true // Đảm bảo không trùng lặp
    },

    // --- LIÊN KẾT TÀI KHOẢN (Tối ưu ObjectId) ---
    // Đổi tên thành user_id (snake_case) hoặc giữ userId tùy convention của bạn, 
    // nhưng type phải là ObjectId
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tên Model User của bạn (để dùng .populate('user_id'))
      // required: true,
    },

    // --- THÔNG TIN NGƯỜI NHẬN ---
    userInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: String, 
      province: String,
      district: String,
      ward: String,
    },

    // --- DANH SÁCH SẢN PHẨM (Tối ưu ObjectId) ---
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Tên Model Product (để .populate('products.product_id'))
          required: true,
        },
        // Vẫn nên lưu cứng các thông tin này tại thời điểm mua
        // để tránh việc sản phẩm gốc thay đổi giá/tên làm sai lệch lịch sử đơn
        name: String,
        image: String,
        price: Number,
        discountPercentage: Number,
        salePrice: Number,
        quantity: { type: Number, required: true, min: 1 },
        size: String,
        subtotal: Number, // Giá * Số lượng (nên lưu để đỡ tính lại)
      }
    ],

    // --- THANH TOÁN & VẬN CHUYỂN ---
    note: String,
    paymentMethod: {
      type: String,
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"], // Chỉ cho phép các giá trị này
      default: "unpaid",
    },
    
    // --- TRẠNG THÁI ĐƠN HÀNG (Quan trọng) ---
    status: {
      type: String,
      // Quy trình chuẩn: Chờ xác nhận -> Đã xác nhận -> Đang giao -> Thành công | Đã hủy
      enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
      default: "pending",
      index: true, // Đánh index để admin lọc đơn theo trạng thái nhanh hơn
    },

    // --- TÀI CHÍNH ---
    shippingFee: { type: Number, default: 0 },
    voucherCode: String,
    discountMoney: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true }, // Tổng tiền cuối cùng khách phải trả
    
    // --- QUẢN LÝ ---
    deleted: {
      type: Boolean,
      default: false, // Dùng cho chức năng xóa mềm (thùng rác)
      index: true,
    },
    deletedAt: Date,
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

// // --- ĐÁNH INDEX MỞ RỘNG ---
// // Giúp tìm kiếm lịch sử đơn hàng của user cực nhanh
// orderSchema.index({ user_id: 1, status: 1 }); 

const Orders = mongoose.model("Orders", orderSchema, "orders");
module.exports = Orders;