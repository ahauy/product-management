const Blog = require("../../models/blog.model")
const BlogCategory = require("../../models/blogCategory.model")
const treeToFlatArray = require("../../helpers/admin/treeToPlatArray.js")
const cloudinary = require("../../config/cloudinary.config");
const uploadImage = require("../../helpers/admin/uploadImage");

// [GET] admin/blog/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  }

  const blog = await Blog.find(find)

  res.render("admin/pages/blog/index.pug", {
    title: "Page Blog",
    blog: blog
  })
}

// [GET] admin/blog/create
module.exports.getCreate = async (req, res) => {

  const findCategory = {
    deleted: false,
    status: "active"
  }

  const record = await BlogCategory.find(findCategory)
  const newRecord = treeToFlatArray(record)


  res.render("admin/pages/blog/createBlog.pug", {
    title: "Create Blog",
    newRecord: newRecord,

  })
}

// [POST] admin/blog/create/:status
module.exports.postCreate = async (req, res) => {

  // Gán trạng thái của bải viết
  const status = req.params.status
  req.body.status = status
  
  // Chỉ upload khi có file, tránh lỗi crash server
  if (req.file) {
    req.body.thumbnail = await uploadImage(req.file);
  }

  // Kiểm tra xem có nhập ngày hay chưa
  if(!req.body.date_client) {
    req.body.date_client = new Date()
  }

  console.log(req.body)
}