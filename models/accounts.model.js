const mongoose = require("mongoose");
const generateRandomString = require("../helpers/admin/generate.js")

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generateRandomString(20), // generate String random length 20 character
    },
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  }
);

const Accounts = mongoose.model("Accounts", accountSchema, "accounts");

module.exports = Accounts;
