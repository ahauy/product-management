const systemAdmin = require("../../config/system")
const ProductsCategory = require("../../models/productsCategory.model")

// [GET] admin/product-category
module.exports.index = async (req, res) => {
  res.render("admin/pages/productsCategory/index.pug", {
    titlePage: "Danh mục sản phẩm", 
  })
}

// [GET] admin/product-category/create
module.exports.create = (req, res) => { 
  res.render("admin/pages/productsCategory/createProductCategory.pug", {
    titlePage: "Thêm danh mục sản phẩm", 
  })
}

// [POST] admin/product-category/create
module.exports.createPost = async (req, res) => {
  if(req.body.position) {
    req.body.position = parseInt(req.body.position)
  } else {
    const count = await ProductsCategory.countDocuments();
    req.body.position = count + 1;
  }

  req.body.thumbnail = `/uploads/${req.file.filename}`

  req.body.title = req.body.title[0]

  const record = await ProductsCategory(req.body);
  await record.save()

  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
}