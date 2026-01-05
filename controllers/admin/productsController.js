const { request } = require("express");
const Products = require("../../models/products.model");
const Accounts = require("../../models/accounts.model");
const Role = require("../../models/role.model");
const systemAdmin = require("../../config/system");
const filterStatusHelpers = require("../../helpers/admin/filterStatus");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");
const { prefixAdmin } = require("../../config/system");
const ProductsCategory = require("../../models/productsCategory.model");
const createTree = require("../../helpers/admin/createTree");
const cloudinary = require("../../config/cloudinary.config");
// const fs = require("fs");
const uploadImage = require("../../helpers/admin/uploadImage");
const treeToFlatArray = require("../../helpers/admin/treeToPlatArray");
const getSubCategory = require("../../helpers/admin/getSubCategory")
// const cloudinary = require('cloudinary').v2;

// NOTE: http://localhost:3000/admin/products/change-status/active/123?page=1
// thì lúc này req.query là những thứ sau dấu ?
// còn req/params là những cái có dấu :

// [GET] admin/products
module.exports.index = async (req, res) => {
  // Tìm kiếm sản phẩm
  let find = {
    deleted: false,
  };

  const records = await ProductsCategory.find(find);
  const newRecords = treeToFlatArray(records);

  // 1. Dùng Aggregate để đếm số lượng sản phẩm theo từng danh mục
  const countProducts = await Products.aggregate([
    {
      $match: {
        deleted: false, // Chỉ đếm các sản phẩm chưa bị xóa
      },
    },
    {
      $group: {
        _id: "$category", // Nhóm theo trường category (ID danh mục)
        count: { $sum: 1 }, // Đếm tổng số
      },
    },
  ]);

  // 2. Gán số lượng trực tiếp (Con nào có sản phẩm thì hiện số đó)
  newRecords.forEach((record) => {
    // Tìm trong mảng countProducts xem có trùng ID không
    const result = countProducts.find(
      (item) =>
        item._id && record._id && item._id.toString() === record._id.toString()
    );
    record.productCount = result ? result.count : 0;
  });

  // 3. Cộng dồn từ con lên cha (FIXED)
  const mapCategory = {};
  newRecords.forEach((record) => {
    mapCategory[record._id.toString()] = record;
  });

  for (let i = newRecords.length - 1; i >= 0; i--) {
    const currentRecord = newRecords[i];
    if (currentRecord.parentId) {
      const parentId = currentRecord.parentId.toString();
      const parentRecord = mapCategory[parentId];
      if (parentRecord) {
        parentRecord.productCount += currentRecord.productCount;
      }
    }
  }

  // Bộ lọc sản phẩm
  // const filterStatus = filterStatusHelpers(req.query);

  // req là phần yêu cầu của người dùng gửi lên sever http://localhost:3000/admin/products?status=active (?status=active đây là phần req và req.query là một đối tượng chứa status=active)
  if (req.query.status) {
    find.status = req.query.status.toLowerCase();
  }

  // lọc sản phẩm theo có nổi bật hay không
  if (req.query.featured) {
    find.featured = req.query.featured;
  }

  // tìm theo danh mục
  if (req.query.category) {
    // 1. Lấy tất cả danh mục con của danh mục đang chọn
    const listSubCategory = await getSubCategory(req.query.category);

    // 2. Tạo mảng chứa ID của danh mục cha + tất cả ID con cháu
    const listSubCategoryId = listSubCategory.map(item => item.id);
    
    // Đừng quên push chính cái ID cha đang chọn vào mảng
    listSubCategoryId.push(req.query.category);

    // 3. Dùng toán tử $in để tìm sản phẩm thuộc bất kỳ ID nào trong mảng trên
    find.category = { $in: listSubCategoryId };
  }

  // Tìm kiếm sản phẩm
  if (searchHelpers(req.query)) {
    find.title = searchHelpers(req.query);
  }

  // Phân trang
  const limit = req.query.limit;
  const countPage = await Products.countDocuments(find);
  const objPagination = paginationHelpers(
    req.query,
    {
      limitItem: limit == undefined ? 4 : limit,
      currentPage: 1,
    },
    countPage
  );

  // sắp xếp sản phẩm
  const sort = {};
  const { sortKey, sortValue } = req.query;
  if (sortKey && sortValue) {
    if (sortKey == "salesCount") {
      sort[`rating.${sortKey}`] = sortValue;
    } else {
      sort[sortKey] = sortValue;
    }
  } else {
    sort.position = "desc";
  }

  // các sản phẩm trả về
  const products = await Products.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip)
    .populate("category", "title")
    .lean();

  for (let product of products) {
    // 1. KIỂM TRA createdBy CÓ TỒN TẠI KHÔNG TRƯỚC KHI DÙNG
    if (product.createdBy && product.createdBy.accountId) {
      const accountCreate = await Accounts.findOne({
        _id: product.createdBy.accountId,
      });

      if (accountCreate) {
        const role = await Role.findOne({ _id: accountCreate.roleId });
        product.createdBy.fullName = accountCreate.fullName;
        product.createdBy.role = role ? role.title : ""; // Thêm check role tồn tại
      }
    } else {
      // Xử lý trường hợp sản phẩm cũ không có người tạo
      // Gán một object rỗng hoặc giá trị mặc định để bên view không bị lỗi
      product.createdBy = {
        fullName: "Không rõ",
        role: "",
      };
    }

    // 2. KIỂM TRA updatedBy CÓ TỒN TẠI KHÔNG
    if (product.updatedBy && product.updatedBy.length > 0) {
      let i = 0;
      for (let acc of product.updatedBy) {
        if (acc && acc.accountId) {
          // Kiểm tra kỹ từng phần tử
          const accUpdate = await Accounts.findOne({ _id: acc.accountId });
          if (accUpdate) {
            const role = await Role.findOne({ _id: accUpdate.roleId });
            product.updatedBy[i].fullName = accUpdate.fullName;
            product.updatedBy[i].role = role ? role.title : "";
          }
        }
        i++;
      }
    }

    // 3. KIỂM TRA deletedBy (Tương tự)
    if (product.deletedBy && product.deletedBy.accountId) {
      const accountDelete = await Accounts.findOne({
        _id: product.deletedBy.accountId,
      });
      if (accountDelete) {
        const role = await Role.findOne({ _id: accountDelete.roleId });
        product.deletedBy.fullName = accountDelete.fullName;
        product.deletedBy.role = role ? role.title : "";
      }
    }
  }

  res.render("admin/pages/products/index2.pug", {
    title: "Trang danh sách sản phẩm",
    products: products,
    totalProducts: countPage,
    // filterStatus: filterStatus,
    pagination: objPagination,
    newRecords: newRecords,
    message: {
      successEdit: req.flash("successEdit"),
      successCreate: req.flash("successCreate"),
    },
  });
};

// [PACTCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;
  const token = req.cookies.token;

  const account = await Accounts.findOne({ token: token });

  const updatedBy = {
    accountId: account._id,
    updatedAt: new Date(),
  };

  await Products.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("successStatus", "Update status success !!");
  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [PACTCH] admin/products/change-featured/:featured/:id
module.exports.changeFeatured = async (req, res) => {
  const { featured, id } = req.params;

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  const updatedBy = {
    accountId: account._id,
    updatedAt: new Date(),
  };

  await Products.updateOne(
    { _id: id },
    { featured: featured, $push: { updatedBy: updatedBy } }
  );

  req.flash("successStatus", "Update featured success !!");
  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [PACTCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // console.log(req.body);

  let { type, ids } = req.body;

  let arrIds = ids.split(",");

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  const updatedBy = {
    accountId: account._id,
    updatedAt: new Date(),
  };

  if (ids) {
    if (type == "active") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash("successStatus", "Update status success !!");
    } else if (type == "inactive") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash("successStatus", "Update status success !!");
    } else if (type == "featured-true") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { featured: true, $push: { updatedBy: updatedBy } }
      );
      req.flash("successStatus", "Update featured success !!");
    } else if (type == "featured-false") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { featured: false, $push: { updatedBy: updatedBy } }
      );
      req.flash("successStatus", "Update featured success !!");
    } else if (type == "delete") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { deleted: true, deleteAt: new Date() }
      );
      req.flash("successDelete", "Delete status success !!");
    } else if (type == "position") {
      for (let item of arrIds) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Products.updateOne(
          { _id: id },
          { position: position, $push: { updatedBy: updatedBy } }
        );
      }
      req.flash("successPosition", "Position update success !!");
    }
  }
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [PACTCH] admin/products/change-position/:id/:position
module.exports.changePosition = async (req, res) => {
  const id = req.params.id;
  const position = parseInt(req.params.position);
  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });
  const updatedBy = {
    accountId: account._id,
    updatedAt: new Date(),
  };

  if (id && position) {
    await Products.updateOne(
      { _id: id },
      { position: position, $push: { updatedBy: updatedBy } }
    );
  }
  req.flash("successPosition", "Position update successful !!");
  res.redirect(`${prefixAdmin}/products`);
};

// [DELETE] admin/products/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  const deletedBy = {
    accountId: account._id,
    deletedAt: new Date(),
  };

  await Products.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: deletedBy,
    }
  );

  req.flash("successDelete", "Delete product success !!");
  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [GET] admin/products/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await ProductsCategory.find(find);
  const newRecords = treeToFlatArray(records);

  res.render("admin/pages/products/createProduct2.pug", {
    title: "Add New Product",
    newRecords: newRecords,
  });
};

// [POST] admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    const find = { deleted: false };
    const files = req.files;
    const urls = await uploadImage(files);
    const token = req.cookies.token;
    // Đếm số lượng sản phẩm hiện tại
    const count = await Products.countDocuments(find);

    const price = parseInt(req.body.price);
    const discountPercentage = parseInt(req.body.discountPercentage);

    const rawSalePrice = price * (1 - discountPercentage / 100);

    const salePrice = Math.round(rawSalePrice / 1000) * 1000;

    // tìm kiếm người dùng
    const account = await Accounts.findOne({
      token: token,
    });

    const product = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: parseInt(req.body.price),
      currency: req.body.currency,
      discountPercentage: parseInt(req.body.discountPercentage),
      salePrice: salePrice,
      gender: req.body.gender,
      variants: JSON.parse(req.body.variants),
      media: urls.map((url) => ({ url, alt: req.body.title })),
      status: req.body.status,
      featured: req.body.featured === "yes" ? true : false,
      position: count + 1,
      deleted: false,
      createdBy: {
        accountId: account._id,
        createdAt: new Date(),
      },
    };

    const record = new Products(product);
    await record.save();

    // Chỉ redirect sau khi tất cả hoàn tất
    req.flash("successCreate", "Success Create Product");
    res.redirect(`${systemAdmin.prefixAdmin}/products`);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Có lỗi xảy ra khi upload ảnh hoặc lưu sản phẩm!");
  }
};

// [GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };

    const findCategory = {
      deleted: false,
    };

    const records = await ProductsCategory.find(findCategory);
    const newRecords = treeToFlatArray(records);

    const product = await Products.findOne(find);

    // console.log(product)

    res.render("admin/pages/products/editProduct2.pug", {
      title: "Edit Products",
      product: product,
      newRecords: newRecords,
    });
  } catch (e) {
    res.redirect(`${systemAdmin.prefixAdmin}/products`);
  }
};

// [PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const price = parseInt(req.body.price);
  const discountPercentage = parseInt(req.body.discountPercentage);
  const token = req.cookies.token;
  let salePrice = 0;

  if (discountPercentage > 0) {
    const rawSalePrice = price * (1 - discountPercentage / 100);
    salePrice = Math.round(rawSalePrice / 1000) * 1000;
    isOnSale = true;
  } else {
    salePrice = price;
  }
  const account = await Accounts.findOne({
    token: token,
  });

  const updatedBy = {
    accountId: account._id,
    updatedAt: new Date(),
  };

  console.log(req.body);

  const product = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price: parseInt(req.body.price),
    currency: req.body.currency,
    discountPercentage: parseInt(req.body.discountPercentage),
    salePrice: salePrice,
    gender: req.body.gender,
    variants: JSON.parse(req.body.variants),
    // media: urls.map((url) => ({ url, alt: req.body.title })),
    status: req.body.status,
    featured: req.body.featured === "yes" ? true : false,
  };

  if (req.file) {
    let urls = uploadImage(req.files);
    product.media = urls.map((url) => ({ url, alt: req.body.title }));
  }

  await Products.updateOne(
    { _id: req.params.id },
    {
      $set: product,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("successEdit", "Success Edit Product !!");
  // console.log(req.flash("successEdit"))
  res.redirect(`${systemAdmin.prefixAdmin}/products`);
};

// [GET] admin/read/:id
module.exports.readProduct = async (req, res) => {
  const find = {
    // deleted: false,
    _id: req.params.id,
  };

  const product = await Products.findOne(find);

  res.render("admin/pages/products/readProduct.pug", {
    title: "Detail Product",
    product: product,
  });
};

// thao tác với các sản phầm đã bị xoá
// [GET] amdin/products/trash
module.exports.getTrash = async (req, res) => {
  const find = {
    deleted: true,
  };

  const user = res.locals.user;
  const role = res.locals.role;

  // Phân trang
  const limit = req.query.limit;
  const countPage = await Products.countDocuments(find);
  const objPagination = paginationHelpers(
    req.query,
    {
      limitItem: limit == undefined ? 4 : limit,
      currentPage: 1,
    },
    countPage
  );

  if (req.query.status) {
    find.status = req.query.status.toLowerCase();
  }

  // lọc sản phẩm theo có nổi bật hay không
  if (req.query.featured) {
    find.featured = req.query.featured;
  }

  // Tìm kiếm sản phẩm
  if (searchHelpers(req.query)) {
    find.title = searchHelpers(req.query);
  }

  // sắp xếp sản phẩm
  const sort = {};
  const { sortKey, sortValue } = req.query;
  if (sortKey && sortValue) {
    if (sortKey == "salesCount") {
      sort[`rating.${sortKey}`] = sortValue;
    } else {
      sort[sortKey] = sortValue;
    }
  } else {
    sort.position = "desc";
  }

  let products = await Products.find(find)
    .lean()
    .limit(objPagination.limitItem)
    .skip(objPagination.skip)
    .populate("category", "title")
    .sort(sort);

  for (let product of products) {
    // 1. KIỂM TRA createdBy CÓ TỒN TẠI KHÔNG TRƯỚC KHI DÙNG
    if (product.createdBy && product.createdBy.accountId) {
      const accountCreate = await Accounts.findOne({
        _id: product.createdBy.accountId,
      });

      if (accountCreate) {
        const role = await Role.findOne({ _id: accountCreate.roleId });
        product.createdBy.fullName = accountCreate.fullName;
        product.createdBy.role = role ? role.title : ""; // Thêm check role tồn tại
      }
    } else {
      // Xử lý trường hợp sản phẩm cũ không có người tạo
      // Gán một object rỗng hoặc giá trị mặc định để bên view không bị lỗi
      product.createdBy = {
        fullName: "Không rõ",
        role: "",
      };
    }

    // 2. KIỂM TRA updatedBy CÓ TỒN TẠI KHÔNG
    if (product.updatedBy && product.updatedBy.length > 0) {
      let i = 0;
      for (let acc of product.updatedBy) {
        if (acc && acc.accountId) {
          // Kiểm tra kỹ từng phần tử
          const accUpdate = await Accounts.findOne({ _id: acc.accountId });
          if (accUpdate) {
            const role = await Role.findOne({ _id: accUpdate.roleId });
            product.updatedBy[i].fullName = accUpdate.fullName;
            product.updatedBy[i].role = role ? role.title : "";
          }
        }
        i++;
      }
    }

    // 3. KIỂM TRA deletedBy (Tương tự)
    if (product.deletedBy && product.deletedBy.accountId) {
      const accountDelete = await Accounts.findOne({
        _id: product.deletedBy.accountId,
      });
      if (accountDelete) {
        const role = await Role.findOne({ _id: accountDelete.roleId });
        product.deletedBy.fullName = accountDelete.fullName;
        product.deletedBy.role = role ? role.title : "";
      }
    }
  }

  if (!role.title.includes("Quản trị viên")) {
    products = products.filter((product) => {
      return product.deletedBy.accountId.toString() === user._id.toString();
    });
  }

  res.render("admin/pages/products/trash.pug", {
    products: products,
    pagination: objPagination,
  });
};

// [PATCH] admin/products/trash/change-multi
module.exports.trashChangeMulti = async (req, res) => {
  let { type, ids } = req.body;

  let arrIds = ids.split(",");

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  if (ids) {
    if (type == "delete") {
      await Products.deleteMany({ _id: { $in: arrIds } });
      req.flash("success", "Delete success !!");
    } else if (type == "restore") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        {
          deleted: false,
          $unset: { deletedBy: 1 },
          $push: {
            updatedBy: {
              accountId: account._id,
              updatedAt: new Date(),
            },
          },
        }
      );
      req.flash("success", "Restore success !!");
    }
  }
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [DELETE] admin/products/trash/delete-product/:id
module.exports.trashDeleteProduct = async (req, res) => {
  const id = req.params.id;

  await Products.deleteOne({ _id: id });

  req.flash("success", "Delete product success !!");

  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [PATCH] admin/products/trash/restore-product/:id
module.exports.trashRestoreProduct = async (req, res) => {
  const id = req.params.id;
  const token = req.cookies.token;
  const role = res.locals.role;
  // let isRestore = true; // vẫn có thể restore sản phẩm

  const account = await Accounts.findOne({ token: token });

  // const product = await Products.findOne({_id: id})

  // if(!role.title.includes("Quản trị viên")) {

  //   const now = new Date()
  //   const deleteAt = new Date(product.deletedBy.deletedAt)
  //   const timeDiff = now - deleteAt // tinh bang mini giay
  //   const limit = 60 * 60 * 1000 // 60phut doi ra mini giay

  //   if(timeDiff > limit) {

  //   }
  // }

  if (id) {
    await Products.updateOne(
      { _id: id },
      {
        deleted: false,
        $unset: { deletedBy: 1 },
        $push: {
          updatedBy: {
            accountId: account._id,
            updatedAt: new Date(),
          },
        },
      }
    );
    req.flash("success", "Restore Success");
    res.redirect("/admin/products");
  } else {
    req.flash("error", "Restore Error");
    const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
    res.redirect(backURL);
  }
};
