const systemAdmin = require("../../config/system");
const ProductsCategory = require("../../models/productsCategory.model");

// [GET] admin/product-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const productCategory = await ProductsCategory.find(find).sort({
    position: "desc",
  });

  res.render("admin/pages/productsCategory/index.pug", {
    titlePage: "Danh mục sản phẩm",
    productCategory: productCategory,
  });
};

// [GET] admin/product-category/create
module.exports.create = (req, res) => {
  res.render("admin/pages/productsCategory/createProductCategory.pug", {
    titlePage: "Thêm danh mục sản phẩm",
  });
};

// [POST] admin/product-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const count = await ProductsCategory.countDocuments();
    req.body.position = count + 1;
  }

  req.body.thumbnail = `/uploads/${req.file.filename}`;

  req.body.title = req.body.title;

  const record = await ProductsCategory(req.body);
  await record.save();

  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
};

// [PATCH] admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;
  await ProductsCategory.updateOne({ _id: id }, { status: status });
  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
};

// [DELETE] admin/product-category/delete-category/:id
module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  await ProductsCategory.updateOne({ _id: id }, { deleted: true });

  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
};

// [GET] admin/product-category/edit/:id
module.exports.edit = async (req, res) => {

  const { id } = req.params;
  const productCategory = await ProductsCategory.findById(id);

  res.render("admin/pages/productsCategory/editProductCategory.pug", {
    title: "Chỉnh sửa danh mục sản phẩm",
    productCategory: productCategory
  });
};

// [PATCH] admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const { id } = req.params;

  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  req.body.title = req.body.title;

  await ProductsCategory.updateOne({ _id: id }, req.body);

  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
}