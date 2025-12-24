const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // Giỏ hàng của ai
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // mỗi user chỉ có 1 cart active
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: String, // lưu tên để hiển thị nhanh
        image: String, // ảnh chính

        size: {
          type: String,
          enum: ["S", "M", "L", "XL", "XXL"],
          required: true,
        },

        // color: {
        //   type: String,
        //   required: true,
        // },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },

        subtotal: {
          type: Number,
          required: true,
        }
      }
    ],

    totalQuantity: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "ordered", "cancelled"],
      default: "active",
    }
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema, "cart");
module.exports = Cart;
