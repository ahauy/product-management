const systemConfig = require('../config/system')
const Accounts = require('../models/accounts.model')

module.exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token
  if(!token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
  } else {
    const user = await Accounts.findOne({token: token}).select('-password')
    if(!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    } else {
      res.locals.user = user;
      next();
    }
  }
}