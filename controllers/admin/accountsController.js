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
const md5 = require('md5')

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
      limitItem: limit ? limit : 6,

    },
    countPage
  );

  // sắp xếp sản phẩm
  const sort = {};
  const { sortKey, sortValue } = req.query;
  if (sortKey && sortValue) {
    sort[sortKey] = sortValue;
  }

  // các sản phẩm trả về
  const accounts = await Accounts.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip)
    .populate('roleId', 'title')

  res.render("admin/pages/accounts/index.pug", {
    title: "Accounts",
    accounts: accounts,
    filterStatus: filterStatus,
    pagination: objPagination,
    message: {
      successEdit: req.flash('successEdit'),
      successCreate: req.flash('successCreate')
    }
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {

  const find = {
    deleted: false,
  }

  const record = await Role.find(find);

  res.render("admin/pages/accounts/createAccount.pug", {
    title: "Accounts",
    record: record
  })
}

// [POST] /admin/acccounts/create
module.exports.createPost = async (req, res) => {
  try {
    const find = {
      deleted: false,
      email: req.body.email
    }
    const isCheckEmail = await Accounts.findOne(find)

    if (!isCheckEmail) {
      
      // Upload Image
      if (req.file) {
        req.body.avatar = await uploadImage(req.file)
      }

      req.body.fullName = `${req.body.lastName} ${req.body.firstName}`
      
      req.body.password = md5(req.body.password)

      const account = new Accounts(req.body)
      await account.save()

      req.flash("successCreate", "Tạo tài khoản thành công !!")
      res.redirect(`${systemAdmin.prefixAdmin}/accounts`)
    } else { 
      req.flash("errorCreate", "Email đã tồn tại !!")
      res.redirect(`${systemAdmin.prefixAdmin}/accounts/create`)
    }
  } catch (error) {
    console.log(error);
    req.flash("errorCreate", "Có lỗi xảy ra trong quá trình tạo!")
    res.redirect(`${systemAdmin.prefixAdmin}/accounts/create`)
  }
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

// [PACTCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // console.log(req.body);

  let { type, ids } = req.body;

  let arrIds = ids.split(",");

  if (ids) {
    if (type == "active") {
      await Accounts.updateMany(
        { _id: { $in: arrIds } },
        { status: "active" }
      );
      req.flash("successStatus", "Update status success !!");
    } else if (type == "inactive") {
      await Accounts.updateMany(
        { _id: { $in: arrIds } },
        { status: "inactive" }
      );
      req.flash("successStatus", "Update status success !!");
    } else if (type == "delete") {
      await Accounts.updateMany(
        { _id: { $in: arrIds } },
        { deleted: true, deleteAt: new Date() }
      );
      req.flash("successDelete", "Delete status success !!");
    }
  }
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    deleted: false
  }

  const findRole = {
    deleted: false
  }

  const account = await Accounts.findOne(find)
  const roles = await Role.find(findRole)

  // account.password = md5(account.password)

  res.render("admin/pages/accounts/editAccounts.pug", {
    title: "Edit Account",
    account: account,
    roles: roles
  })
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const {id} = req.params

  // tìm tất cả các bản ghi có email là req.body.email và ngoại trừ bản ghi có id là id
  const find = {
    _id: { $ne: id },
    email: req.body.email,
    deleted: false
  }

  const isCheckEmail = await Accounts.findOne(find)

  if(!isCheckEmail) {
    if(req.file) {
      req.body.avatar = await uploadImage(req.file)
    }
  
    req.body.fullName = `${req.body.lastName} ${req.body.firstName}`
  
    req.body.password = md5(req.body.password)
  
    // update accounts by id
    await Accounts.updateOne({_id: id}, req.body)
    
    req.flash("successEdit", "Success Edit Accout")
    res.redirect(`${systemAdmin.prefixAdmin}/accounts`)
  } else {
    req.flash('errorEdit', "Email already exists !!")
    res.redirect(`${systemAdmin.prefixAdmin}/acccounts/edit/${id}`)
  }
}

// [GET] admin/accounts/read/:id
module.exports.read = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id
  }

  const findRole = {
    deleted: false
  }

  const account = await Accounts.findOne(find)
  const roles = await Role.find(findRole)

  res.render("admin/pages/accounts/readAccount.pug", {
    title: "Account",
    account: account,
    roles: roles
  })
} 