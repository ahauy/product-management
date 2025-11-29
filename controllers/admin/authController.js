const Accounts = require("../../models/accounts.model");
const systemAdmin = require("../../config/system");
const md5 = require('md5')

// [GET] admin/auth/login
module.exports.login = (req, res) => {
  res.render('admin/pages/auth/login.pug')
}

// [GET] admin/auth/login
module.exports.loginPost = async (req, res) => {
  const {email, password} = req.body

  const user = await Accounts.findOne({
    email: email,
    deleted: false
  })

  if(!user) {
    req.flash('error', 'Email does not exit !')
    res.redirect(`${systemAdmin.prefixAdmin}/auth/login`)
    return 
  } else {
    if(user.password !== md5(password)) {
      req.flash('error', 'You entered the wrong password !')
      res.redirect(`${systemAdmin.prefixAdmin}/auth/login`)
      return 
    } else if(user.status !== 'active') {
      req.flash('error', 'Your account has been locked !')
      res.redirect(`${systemAdmin.prefixAdmin}/auth/login`)
      return 
    }
  }

  res.redirect(`${systemAdmin.prefixAdmin}/dashboard`)
}