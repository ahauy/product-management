const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    // cardId: String, // Thường khi đã đặt hàng thành công thì không cần lưu cardId nữa, tùy logic của bạn
    userInfo: {
      fullName: { type: String, required: true },
      email: String,
      phone: { type: String, required: true },
      address: String, // Địa chỉ nhà cụ thể (số nhà, đường)
      province: String, // Tỉnh/Thành phố (Bổ sung từ UI)
      district: String, // Quận/Huyện (Bổ sung từ UI)
      ward: String,     // Phường/Xã (Bổ sung từ UI)
    },
    note: String, // Bổ sung: Ghi chú thêm từ khách hàng
    paymentMethod: {
      type: String,
      default: "COD", // Ví dụ: "COD" hoặc "MOMO"
    },
    paymentStatus: {
      type: String,
      default: "unpaid", // unpaid (chưa tt), paid (đã tt) - Dành cho MoMo
    },
    status: {
      type: String,
      default: "pending", // pending, confirm, shipping, success, cancel
    },
    products: [
      {
        productId: String,
        title: String, // Bổ sung: Lưu tên sp lúc mua
        thumbnail: String, // Bổ sung: Lưu ảnh sp lúc mua
        price: Number,
        discountPercentage: Number,
        quantity: Number,
        size: String, // Bổ sung CỰC KỲ QUAN TRỌNG cho shop thời trang
      }
    ],
    // Các trường tính toán tiền
    shippingFee: { type: Number, default: 0 }, // Phí giao hàng
    voucherCode: String, // Mã giảm giá đã dùng
    discountMoney: { type: Number, default: 0 }, // Số tiền được giảm
    totalPrice: Number, // Tổng tiền cuối cùng khách phải trả
  },
  {
    timestamps: true,
  }
);

// Sửa lỗi sai tên export (Cart -> Orders)
const Orders = mongoose.model("Orders", orderSchema, "orders");
module.exports = Orders;