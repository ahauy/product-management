const Role = require("../../models/role.model");
const systemAdmin = require("../../config/system");

// [GET] /admin/role/index
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const role = await Role.find(find);

  res.render("admin/pages/role/index.pug", {
    titlePage: "Nhóm quyền",
    role: role,
  });
};

// [GET] admin/role/create
module.exports.getCreate = (req, res) => {
  res.render("admin/pages/role/createRole.pug", {
    titlePage: "Thêm mới nhóm quyền",
  });
};

// [POST] admin/role/create
module.exports.postCreate = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

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
    titlePage: "Sửa nhóm quyền",
    record: record,
  });
};

// [PATCH] admin/role/edit/:id
module.exports.patchEdit = async (req, res) => {
  const { id } = req.params;
  const dataUpdate = req.body; // Dữ liệu đã được parse
  console.log(dataUpdate);
  try {
    await Role.updateOne(
      { _id: id },
      dataUpdate // Sử dụng dataUpdate
    );
    res.redirect(`${systemAdmin.prefixAdmin}/role/edit/${id}`);
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

  res.redirect(`${systemAdmin.prefixAdmin}/role`);
};
