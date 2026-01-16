const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
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
    
    deleted: {
      type: Boolean,
      default: false,
    },
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
  }
);


const BlogCategory = mongoose.model(
  "BlogCategory",
  blogCategorySchema,
  "blog-category"
);

module.exports = BlogCategory;
