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
  const products = await Products.find(find).sort({
    position: "desc"
  })
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

// [PACTCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  await Products.updateOne({ _id: id }, { status: status });

  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [PACTCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // console.log(req.body);

  const { type, ids } = req.body;

  const arrIds = ids.split(",");

  if (ids) {
    if (type == "active") {
      await Products.updateMany({ _id: { $in: arrIds } }, { status: "active" });
    } else if (type == "inactive") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { status: "inactive" }
      );
    } else if (type == "delete") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { deleted: true, deleteAt: new Date() }
      );
    } else if (type == "position") {
      for (const item of arrIds) {
        const [id, position] = item.split("-");
        position = parseInt(position);
        await Products.updateOne({ _id: id }, { position: position });
      }
    }
  }
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [DELETE] admin/product/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  await Products.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteAt: new Date(),
    }
  );

  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};
