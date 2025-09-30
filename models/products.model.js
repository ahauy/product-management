const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date,
  slug: {
    type: String,
    slug: "title",
    unique: true
  }
}, {
  timestamps: true
})

const Product = mongoose.model("Product", productSchema, "products")

module.exports = Product;