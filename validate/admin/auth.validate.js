const systemAdmin = require("../../config/system");

module.exports.loginPost = (req, res, next) => {

  if(!req.body.email) {
    req.flash('warning', 'Please enter email !')
    res.redirect(`${systemAdmin.prefixAdmin}/auth/login`)
    return
  }

  if(!req.body.password) {
    req.flash('warning', 'Please enter password !')
    res.redirect(`${systemAdmin.prefixAdmin}/auth/login`)
    return
  }

  next()
}