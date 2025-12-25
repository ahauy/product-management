const User = require('../../models/users.model')

module.exports.infoUser = async (req, res, next) => {

  const tokenUser = req.cookies.tokenUser

  const user = await User.findOne({
    tokenUser: tokenUser,
    deleted: false,
  }).select('-password')

  if(user) {
    res.locals.user = user
  }

  next();
}