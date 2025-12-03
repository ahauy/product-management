const Role = require("../../models/role.model");
const systemAdmin = require("../../config/system");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");

// [GET] /admin/role/index
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  // Tìm kiếm sản phẩm
  if (searchHelpers(req.query)) {
    find.title = searchHelpers(req.query);
  }

  // Phân trang
  const limit = req.query.limit;
  const countPage = await Role.countDocuments(find);
  const objPagination = paginationHelpers(
    req.query,
    {
      limitItem: limit == undefined ? 4 : limit,
      currentPage: 1,
    },
    countPage
  );

  const records = await Role.find(find)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip)

  res.render("admin/pages/role/index.pug", {
    title: "Role",
    records: records,
    pagination: objPagination,
    message: {
      successEdit: req.flash('successEdit'),
      successCreate: req.flash('successCreate')
    }
  });
};

// [GET] admin/role/create
module.exports.getCreate = (req, res) => {
  res.render("admin/pages/role/createRole.pug", {
    title: "Create Role",
  });
};

// [POST] admin/role/create
module.exports.postCreate = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  req.flash("successCreate", "Success create Role");
  res.redirect(`${systemAdmin.prefixAdmin}/role`);
};

// [GET] admin/role/edit/:id
module.exports.getEdit = async (req, res) => {
  const { id } = req.params;

  const find = {
    deleted: false,
    _id: id,
  };

  const record = await Role.findOne(find);

  res.render("admin/pages/role/editRole.pug", {
    title: "Edit Role",
    record: record,
  });
};

// [PATCH] admin/role/edit/:id
module.exports.patchEdit = async (req, res) => {
  const { id } = req.params;
  try {
    await Role.updateOne(
      { _id: id },
      req.body
    );
    req.flash("successEdit", "Success Edit Role");
    res.redirect(`${systemAdmin.prefixAdmin}/role/`);
  } catch (error) {
    console.error(error);
    // Xử lý lỗi nếu update thất bại
    res.redirect(`${systemAdmin.prefixAdmin}/role`);
  }
};

// [DELETE] admin/role/delete-role
module.exports.deleteRole = async (req, res) => {
  const { id } = req.params;

  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteAt: new Date(),
    }
  );
  req.flash("successDelete", "Delete role success !!");
  res.redirect(`${systemAdmin.prefixAdmin}/role`);
};

// [GET] /admin/role/read/:id
module.exports.read = async (req, res) => {
  const {id} = req.params
  const record = await Role.findOne({_id: id})

  res.render("admin/pages/role/readRole.pug", {
    title: "Read Role",
    record: record,
  })
}

// [GET] admin/role/role-permission
module.exports.getPermission = async (req, res) => {

  const find = {
    deleted: false,
  };

  const count = await Role.countDocuments(find)

  const roles = await Role.find(find);

  res.render("admin/pages/role/permission2.pug", {
    title: "Permission",
    roles: roles,
    count: count,
  });
};

// [PATCH] admin/role/permission
module.exports.patchPermission = async (req, res) => {
  const permission = JSON.parse(req.body.permission)
  for(item of permission) {
    await Role.updateOne({_id: item.id}, {permissions: item.permission})
  }
  res.redirect(`${systemAdmin.prefixAdmin}/role/permission`)
}
