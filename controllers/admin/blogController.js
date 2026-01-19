const Blog = require("../../models/blog.model")

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
  res.render("admin/pages/blog/createBlog.pug", {
    title: "Create Blog"
  })
}