const { request } = require("express");
const Accounts = require("../../models/accounts.model");
const systemAdmin = require("../../config/system");
const filterStatusHelpers = require("../../helpers/admin/filterStatus");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");
const { prefixAdmin } = require("../../config/system");
const Role = require("../../models/role.model");
const cloudinary = require("../../config/cloudinary.config");
// const fs = require("fs");
const uploadImage = require("../../helpers/admin/uploadImage")

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
  // Tìm kiếm sản phẩm
    const regex = searchHelpers(req.query); // Gọi hàm helper 1 lần thôi để lấy regex
    if (regex) {
      find.fullName = regex
    }
  // Phân trang
  const limit = req.query.limit;
  const countPage = await Accounts.countDocuments(find);
  const objPagination = paginationHelpers(
    req.query,
    {
      limitItem: limit == undefined ? 4 : limit,
      currentPage: 1,
    },
    countPage
  );

  // sắp xếp sản phẩm
  const sort = {};
  const { sortKey, sortValue } = req.query;
  if (sortKey && sortValue) {
    if (sortKey == "salesCount") {
      sort[`rating.${sortKey}`] = sortValue;
    } else {
      sort[sortKey] = sortValue;
    }
  } else {
    sort.position = "desc";
  }

  // các sản phẩm trả về
  const accounts = await Accounts.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip)

  res.render("admin/pages/accounts/index.pug", {
    title: "Accounts",
    accounts: accounts,
    filterStatus: filterStatus,
    pagination: objPagination,
  });
};

// [GET] /admin/role/create
module.exports.create = async (req, res) => {

  const find = {
    deleted: false,
  }

  const role = await Role.find(find);

  res.render("admin/pages/accounts/createAccount.pug", {
    title: "Accounts",
    role: role
  })
}

// [POST] /admin/role/create
module.exports.createPost = async (req, res) => {
  
  // upload Image
  if(req.file) {
    req.body.avatar = await uploadImage(req.file)
  }

  req.body.fullName = `${req.body.lastName} ${req.body.firstName}`

  const account = new Accounts(req.body)  
  await account.save()

  req.flash("successCreate", "Success Create Account !!")
  res.redirect(`${systemAdmin.prefixAdmin}/accounts`)
}

// [PATCH] admin/acccounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  await Accounts.updateOne({ _id: id }, { status: status });

  req.flash("successStatus", "Update status success !!");
  res.redirect(`${systemAdmin.prefixAdmin}/accounts`);
};

// [DELETE] admin/accounts/delete-accounts/:id
module.exports.deleteAccount = async (req, res) => {
  const { id } = req.params;

  await Accounts.updateOne({ _id: id }, { deleted: true });

  req.flash("successDelete", "Success Delete Account !")
  res.redirect(`${systemAdmin.prefixAdmin}/accounts`);
};