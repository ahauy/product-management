const Role = require('../../models/role.model')
const systemAdmin = require("../../config/system")

// [GET] /admin/role/index
module.exports.index = async (req, res) => {

  const find = {
    deleted: false,
  }

  const role = await Role.find(find)

  res.render('admin/pages/role/index.pug', {
    titlePage: "Nhóm quyền",
    role: role,
  })
} 

// [GET] admin/role/create
module.exports.getCreate = (req, res) => {
  res.render('admin/pages/role/createRole.pug', {
    titlePage: "Thêm mới nhóm quyền"
  })
}

// [POST] admin/role/create
module.exports.postCreate = async (req, res) => {
  const record = new Role(req.body)
  await record.save()

  res.redirect(`${systemAdmin.prefixAdmin}/role`)
}