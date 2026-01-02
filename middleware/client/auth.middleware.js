const User = require("../../models/users.model")

module.exports.authMiddleware = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser

  if(!tokenUser) {
    res.redirect("/user")
    return
  }

  const user = await User.findOne({tokenUser: tokenUser})

  if(!user) {
    res.redirect("/user")
    return
  }

  next();
}