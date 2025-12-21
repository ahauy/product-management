const ProductsCategory = require("../../models/productsCategory.model");
const createTreeHelper = require("../../helpers/client/createTree"); // Nhớ đường dẫn file helper
const Products = require("./../../models/products.model");
const formatMoney = require('../../helpers/client/formatMoney')

module.exports.index = async (req, res) => {
  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };

  // tìm sản phẩm nổi bật
  const findProductFeatured = {
    deleted: false,
    status: "active",
    featured: true,
  };

  const findProductNew = {
    deleted: false,
    status: "active",
  };

  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);

  const productsFeatured = await Products.find(findProductFeatured).limit(8);

  const productsNew = await Products.find(findProductNew)
    .limit(8)
    .sort({ position: "desc" });

  res.render("client/pages/home/index.home.pug", {
    titlePage: "Home Page",
    layoutProductsCategory: newRecords, // Truyền biến này sang view
    productsFeatured: productsFeatured,
    productsNew: productsNew,
    formatMoney: formatMoney,
  });
};
