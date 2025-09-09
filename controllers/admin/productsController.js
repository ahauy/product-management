const { request } = require("express");
const Products = require("../../models/products.model");

const filterStatusHelpers = require("../../helpers/admin/filterStatus");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");

// NOTE: http://localhost:3000/admin/products/change-status/active/123?page=1
// thì lúc này req.query là những thứ sau dấu ?
// còn req/params là những cái có dấu :

// [GET] admin/products
module.exports.index = async (req, res) => {
  // Tìm kiếm sản phẩm
  let find = {
    deleted: false,
  };

  // Bộ lọc sản phẩm
  const filterStatus = filterStatusHelpers(req.query);

  // console.log(filterStatus)

  // req là phần yêu cầu của người dùng gửi lên sever http://localhost:3000/admin/products?status=active (?status=active đây là phần req và req.query là một đối tượng chứa status=active)
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm sản phẩm
  if (searchHelpers(req.query)) {
    find.title = searchHelpers(req.query);
  }

  // Phân trang
  const countPage = await Products.countDocuments(find);
  const objPagination = paginationHelpers(
    req.query,
    {
      limitItem: 4,
      currentPage: 1,
    },
    countPage
  );

  // các sản phẩm trả về
  const products = await Products.find(find)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip);

  // console.log((products))

  res.render("admin/pages/products/index.pug", {
    title: "Trang danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    pagination: objPagination,
  });
};

// [GET] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params
  
  await Products.updateOne({ _id: id }, {status: status})

  // res.redirect(`/admin/products/`)
  const backURL = req.header('Referer') || '/'; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
}