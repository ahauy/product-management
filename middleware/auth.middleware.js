const systemConfig = require('../config/system')
const Accounts = require('../models/accounts.model')
const Role = require('../models/role.model')

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token
  if(!token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
  } else {
    const user = await Accounts.findOne({token: token}).select('-password')
    if(!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    } else {
      const role = await Role.findOne({
        _id: user.roleId,
        deleted: false,
      }).select("title permissions")
      res.locals.role = role;
      res.locals.user = user;
      next();
    }
  }
}