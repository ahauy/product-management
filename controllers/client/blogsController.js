const Blogs=  require("../../models/blog.model")

module.exports.blogDetail = async (req, res) => {
  const slug = req.params.slug

  const blog = await Blogs.findOne({slug: slug})

  res.render("client/pages/blog/blogDetail.pug", {
    blog: blog
  })
}

