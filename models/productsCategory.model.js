const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productsCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_Id: {
      type: String,
      default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
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
