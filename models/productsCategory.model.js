const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productsCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products-category",
      default: null,
    },
    description: String,
    thumbnail: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    position: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
  }
);

const ProductsCategory = mongoose.model(
  "ProductsCategory",
  productsCategorySchema,
  "products-category"
);

module.exports = ProductsCategory;
