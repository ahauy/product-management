const ProductsCategory = require("../../models/productsCategory.model");
const createTreeHelper = require("../../helpers/client/createTree"); // Nhớ đường dẫn file helper
const User = require("../../models/users.model");
const Cart = require("../../models/cart.model");
const Orders = require("../../models/orders.model");
const md5 = require("md5");
const formatMoney = require("../../helpers/client/formatMoney");
const generate = require("../../helpers/admin/generate")
const PasswordForgot = require("../../models/password-forgot.model")

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

  res.render("client/pages/user/login.pug", {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  });
};

// [POST] user/register
module.exports.postRegister = async (req, res) => {
  const exitsEmail = await User.findOne({
    deleted: false,
    email: req.body.email,
  });

  if (!exitsEmail) {
    const userInfo = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      phone: req.body.phone,
    };

    const user = new User(userInfo);
    await user.save();

    // res.cookie("tokenUser", user.tokenUser)

    res.redirect("/user");
  } else {
    req.flash("error", "Email của bạn đã được dùng !");
    res.redirect("/user/register");
    return;
  }
};

// [POST] user/login
module.exports.postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email của bạn không đúng !");
    res.redirect("/user");
    return;
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Mật khẩu của bạn bị sai !");
    res.redirect("/user");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập thành công");
  res.redirect("/");
};

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
  res.render("client/pages/user/info.pug", {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  });
};

// [PATCH] user/password/change
module.exports.changePassword = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findOne({
    tokenUser: tokenUser,
    deleted: false,
  });

  if (user.password !== md5(oldPassword)) {
    req.flash("error", "Mật khẩu cũ của bạn không khớp !");
  }

  await User.updateOne({ _id: user.id }, { password: md5(newPassword) });
  req.flash("success", "Cập nhật mật khẩu thành công");

  res.redirect("/user/info");
};

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

  const cartId = req.cookies.cartId;

  const orders = await Orders.find({ cartId: cartId });

  // console.log(orders)

  res.render("client/pages/user/orders.pug", {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
    orders: orders,
    formatMoney: formatMoney,
  });
};

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

  const user = await User.findOne({ tokenUser: req.cookies.tokenUser });

  const addresses = user.addresses;
  res.render("client/pages/user/address.pug", {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
    addresses: addresses,
  });
};

// [POST] /user/address/create
module.exports.createAddress = async (req, res) => {
  try {
    const user = res.locals.user; // Lấy user từ middleware auth

    // 1. Tạo object địa chỉ mới từ dữ liệu Form
    const newAddress = {
      name: req.body.name, // Schema là 'name', form gửi lên là 'fullName'
      phone: req.body.phone,
      address: req.body.address,
      province: req.body.province,
      district: req.body.district,
      ward: req.body.ward,
      isDefault: req.body.isDefault === "on", // Checkbox gửi lên "on" nếu được tick
    };

    // 2. Xử lý Logic Địa chỉ mặc định
    // Nếu user chọn địa chỉ này là mặc định, ta phải set tất cả địa chỉ cũ thành false
    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // 3. Push vào mảng addresses
    user.addresses.push(newAddress);

    // 4. Lưu vào Database
    await user.save();

    req.flash("success", "Thêm địa chỉ mới thành công!");
    res.redirect("/user/address");
  } catch (error) {
    console.log(error);
    req.flash("error", "Lỗi thêm địa chỉ!");
    res.redirect("/user/address");
  }
};

// [PATCH] /user/address/edit/:id
module.exports.updateAddress = async (req, res) => {
  try {
    const user = res.locals.user;
    const addressId = req.params.addressId;
    const isDefault = req.body.isDefault === "on";

    // 1. Tìm địa chỉ con cần sửa trong mảng addresses bằng ID
    const address = user.addresses.id(addressId);

    if (!address) {
      req.flash("error", "Không tìm thấy địa chỉ!");
      res.redirect("/user/address");
    }

    // 2. Nếu set địa chỉ này là mặc định -> Reset các cái khác về false
    if (isDefault) {
      user.addresses.forEach((addr) => {
        // addr._id là Object, addressId là String nên cần convert để so sánh hoặc chỉ set all false
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    // 3. Cập nhật thông tin mới
    address.name = req.body.name;
    address.phone = req.body.phone;
    address.address = req.body.address;
    address.province = req.body.province;
    address.district = req.body.district;
    address.ward = req.body.ward;
    address.isDefault = isDefault;

    // 4. Lưu thay đổi
    await user.save();

    req.flash("success", "Cập nhật địa chỉ thành công!");
    res.redirect("/user/address");
  } catch (error) {
    console.log(error);
    req.flash("error", "Lỗi cập nhật địa chỉ!");
    res.redirect("/user/address");
  }
};

// [GET] /user/address/delete/:id
module.exports.deleteAddress = async (req, res) => {
  try {
    const user = res.locals.user;
    const addressId = req.params.addressId;

    // Dùng method pull của Mongoose để xóa phần tử khỏi mảng
    user.addresses.pull(addressId);

    await user.save();

    req.flash("warning", "Đã xóa địa chỉ!");
    res.redirect("/user/address");
  } catch (error) {
    console.log(error);
    res.redirect("/user/address");
  }
};

// [GET] /user/address/default/:addressId
module.exports.defaultAddress = async (req, res) => {
  try {
    const user = res.locals.user;
    const addressId = req.params.addressId;

    // 1. Tìm địa chỉ cần set làm mặc định
    const addressToSet = user.addresses.id(addressId);

    if (!addressToSet) {
      req.flash("error", "Không tìm thấy địa chỉ!");
      return res.redirect("/user/address");
    }

    // 2. Reset TẤT CẢ địa chỉ về false
    // (Duyệt qua mảng addresses có sẵn trong user)
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });

    // 3. Set địa chỉ mục tiêu thành true
    addressToSet.isDefault = true;

    // 4. Lưu thay đổi vào Database (Chỉ tốn 1 lệnh này)
    await user.save();

    req.flash("success", "Đã thay đổi địa chỉ mặc định!");
    res.redirect("/user/address");
    
  } catch (error) {
    console.log(error);
    req.flash("error", "Lỗi cập nhật địa chỉ!");
    res.redirect("/user/address");
  }
};

// [GET] user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser')
  res.redirect('/user')
};

// [GET] user/password/forgot
module.exports.getPasswordForgot = async (req, res) => {
  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);

  res.render("client/pages/user/passwordForgot.pug", {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  })
}

// [POST] user/password/forgot
module.exports.postPasswordForgot = async (req, res) => {
  const email = req.body.email
  
  const user = await User.findOne({
    email: email,
    deleted: false,
  })

  if(user) {

    const objForgot = {
      email: email,
      OTP: generate.generateRandomStringOTP(6),
      expireAt: Date.now()
    }

    console.log(objForgot)

    const passwordForgot = new PasswordForgot(objForgot)
    await passwordForgot.save()

    res.redirect(`/user/password/otp?email=${email}`);
  } else {
    req.flash("error", "Email không chính xác !")
    res.redirect("/user/password/forgot")
  }
}

// [GET] user/password/otp
module.exports.getOTP = async (req, res) => {
  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);


  const email = req.query.email

  res.render("client/pages/user/password-OTP.pug", {
    email: email,
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  })
}

// [POST] user/password/otp
module.exports.postOTP = async (req, res) => {
  const email = req.query.email
  const otp = req.body.otp

  const isCheck = await PasswordForgot.findOne({
    email: email,
    OTP: otp
  })

  if(isCheck) {
    res.redirect(`/user/password/new-password?email=${email}`)
  } else {
    req.flash("error", "Mã OTP sai !")
    res.redirect("/user/password/otp")
  }
}

// [GET] user/password/new-password
module.exports.getNewPassword = async (req, res) => {
  // 1. Lấy danh mục "active" và chưa bị xóa
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);

  // 2. Tạo cây danh mục (Level 1 -> Level 2 -> Level 3)
  const newRecords = createTreeHelper(records);

  res.render("client/pages/user/newPassword.pug", {
    layoutProductsCategory: newRecords, // Truyền biến này sang view
  })
}