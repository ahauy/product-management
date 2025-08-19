module.exports.dashboard = (req, res) => {
  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Admin pages"
  })
}