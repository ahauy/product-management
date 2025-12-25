const Accounts = require("../../models/accounts.model");
const systemAdmin = require("../../config/system");
const md5 = require('md5')

// [GET] admin/auth/login
module.exports.login = async (req, res) => {
  if(req.cookies.token) {
    const user = await Accounts.findOne({token: req.cookies.token})
    if(user) {
      res.redirect(`${systemAdmin.prefixAdmin}/dashboard`)
    }
  }
  res.render('admin/pages/auth/login.pug')
}

// [POST] admin/auth/login
module.exports.loginPost = async (req, res) => {
  const {email, password} = req.body

  const user = await Accounts.findOne({
    email: email,
    deleted: false
  })

  // console.log(user.password)
  // console.log(md5(password))

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
  res.cookie('token', user.token)
  res.redirect(`${systemAdmin.prefixAdmin}/dashboard`)
}

// [GET] admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie('token')
  res.redirect(`${systemAdmin.prefixAdmin}/auth/login`)
}