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


// [GET] admin/accounts/read/:id
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index.pug", {
    title: "Account",
    message: {
      successEdit: req.flash("successEdit"),
      errorEdit: req.flash("errorEdit"),
    }
  })
} 


// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => { 
  const findRole = {
    deleted: false
  }

  const roles = await Role.find(findRole)

  // account.password = md5(account.password)

  res.render("admin/pages/my-account/edit.pug", {
    title: "Edit Account",
    roles: roles
  })
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id

  // tìm tất cả các bản ghi có email là req.body.email và ngoại trừ bản ghi có id là id
  const find = {
    _id: { $ne: id },
    email: res.locals.user.email,
    deleted: false
  }

  const isCheckEmail = await Accounts.findOne(find)

  if(!isCheckEmail) {
    if(req.file) {
      req.body.avatar = await uploadImage(req.file)
    }
  
    req.body.fullName = `${req.body.lastName} ${req.body.firstName}`
  
    if(req.body.password) {
      req.body.password = md5(req.body.password)
    }
  
    // update accounts by id
    await Accounts.updateOne({_id: id}, req.body)
    
    req.flash("successEdit", "Success Edit Accout")
    res.redirect(`${systemAdmin.prefixAdmin}/my-account`)
  } else {
    req.flash('errorEdit', "Email already exists !!")
    res.redirect(`${systemAdmin.prefixAdmin}/my-account/edit`)
  }
}
