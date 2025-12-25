const ProductsCategory = require("../../models/productsCategory.model");
const createTreeHelper = require("../../helpers/client/createTree"); // Nhớ đường dẫn file helper
const User = require('../../models/users.model')
const md5 = require('md5')

// [GET] user/
module.exports.getUser = async (req, res) => {

  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);

  res.render('client/pages/user/login.pug', {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  })
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

    // res.cookie("tokenUser", user.tokenUser)

    res.redirect("/user");
  } else {
    req.flash('error', "Email của bạn đã được dùng !")
    res.redirect('/user/register')
    return
  }
}

// [POST] user/login
module.exports.postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  })

  if(!user) {
    req.flash('error', 'Email của bạn không đúng !')
    res.redirect('/user')
    return
  }

  if(md5(password) !== user.password) {
    req.flash('error', 'Mật khẩu của bạn bị sai !')
    res.redirect('/user')
    return
  }

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập thành công")
  res.redirect('/');
}

// [GET] user/info 
module.exports.getInfo = async (req, res) => {
  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);
  res.render('client/pages/user/info.pug', {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  })
}

// [GET] user/orders
module.exports.getOrders = async (req, res) => {
  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);
  res.render('client/pages/user/orders.pug', {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  })
}

// [GET] user/address
module.exports.getAddress = async (req, res) => {
  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);
  res.render('client/pages/user/address.pug', {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  })
}

// [GET] user/logout
module.exports.logout = async (req, res) => {
  res.send('ok')
}