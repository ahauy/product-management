module.exports.confirmPassword = (req, res, next) => {

  if(!req.body.password) {
    req.flash("missingPassword", "Mật khẩu không được để trống !")
    res.redirect("/user/password/new-password")
  }

  if(!req.body.confirmPassword) {
    req.flash("missingConfirmPassword", "Xác nhận mật khẩu không được để trống !")
    res.redirect("/user/password/new-password")
  }

  if(req.body.password != req.body.confirmPassword) {
    req.flash("errorConfirmPassword", "Mật khẩu xác nhận sai !")
    res.redirect("/user/password/new-password")
  }

  next()
}