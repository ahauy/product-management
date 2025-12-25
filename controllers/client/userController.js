const User = require('../../models/users.model')
const md5 = require('md5')

// [GET] user/register
module.exports.getUser = async (req, res) => {
  res.render('client/pages/user/login.pug')
}

// [POST] user/register
module.exports.postRegister = async (req, res) => {


  const exitsEmail = await User.findOne({
    deleted: false,
    email: req.body.email
  })

  if(!exitsEmail) {
    const userInfo = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      phone: req.body.phone
    }
  
    const user = new User(userInfo)
    await user.save()

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/user/login");
  } else {
    req.flash('error', "Email của bạn đã được dùng !")
    req.redirect('/user/register')
    return
  }
}