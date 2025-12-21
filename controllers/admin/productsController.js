const { request } = require("express");
const Products = require("../../models/products.model");
const systemAdmin = require("../../config/system");
const filterStatusHelpers = require("../../helpers/admin/filterStatus");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");
const { prefixAdmin } = require("../../config/system");
const ProductsCategory = require("../../models/productsCategory.model");
const createTree = require("../../helpers/admin/createTree");
const cloudinary = require("../../config/cloudinary.config");
// const fs = require("fs");
const uploadImage = require("../../helpers/admin/uploadImage")
const treeToFlatArray = require("../../helpers/admin/treeToPlatArray");
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

  // Bộ lọc sản phẩm
  const filterStatus = filterStatusHelpers(req.query);

  // console.log(filterStatus)

  // req là phần yêu cầu của người dùng gửi lên sever http://localhost:3000/admin/products?status=active (?status=active đây là phần req và req.query là một đối tượng chứa status=active)
  if (req.query.status) {
    find.status = req.query.status;
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
    .populate('category', 'title')

  res.render("admin/pages/products/index2.pug", {
    title: "Trang danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    pagination: objPagination,
    message: {
      successEdit: req.flash('successEdit'),
      successCreate: req.flash('successCreate')
    }
  });
};

// [PACTCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  await Products.updateOne({ _id: id }, { status: status });

  req.flash("successStatus", "Update status success !!");
  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [PACTCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // console.log(req.body);

  let { type, ids } = req.body;

  let arrIds = ids.split(",");

  if (ids) {
    if (type == "active") {
      await Products.updateMany({ _id: { $in: arrIds } }, { status: "active" });
      req.flash("successStatus", "Update status success !!");
    } else if (type == "inactive") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { status: "inactive" }
      );
      req.flash("successStatus", "Update status success !!");
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
        await Products.updateOne({ _id: id }, { position: position });
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
  if (id && position) {
    await Products.updateOne({ _id: id }, { position: position });
  }
  req.flash("successPosition", "Position update successful !!");
  res.redirect(`${prefixAdmin}/products`);
};

// [DELETE] admin/products/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  await Products.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteAt: new Date(),
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
    const urls = await uploadImage(files)
    // Đếm số lượng sản phẩm hiện tại
    const count = await Products.countDocuments(find);

    const product = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: parseInt(req.body.price),
      currency: req.body.currency,
      discountPercentage: parseInt(req.body.discountPercentage),
      salePrice:
        (parseInt(req.body.price) *
          (100 - parseInt(req.body.discountPercentage))) /
        100,
      gender: req.body.gender,
      variants: JSON.parse(req.body.variants),
      media: urls.map((url) => ({ url, alt: req.body.title })),
      status: req.body.status,
      featured: req.body.featured === "yes" ? true : false,
      position: count + 1,
      deleted: false,
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
  const product = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price: parseInt(req.body.price),
    currency: req.body.currency,
    discountPercentage: parseInt(req.body.discountPercentage),
    salePrice:
      (parseInt(req.body.price) *
        (100 - parseInt(req.body.discountPercentage))) /
      100,
    gender: req.body.gender,
    variants: JSON.parse(req.body.variants),
    // media: urls.map((url) => ({ url, alt: req.body.title })),
    status: req.body.status,
    featured: req.body.featured === "yes" ? true : false,
  };

  if (req.file) {
    let urls = uploadImage(req.files)
    product.media = urls.map((url) => ({ url, alt: req.body.title }))
  }


  await Products.updateOne({ _id: req.params.id }, product);

  req.flash("successEdit", "Success Edit Product !!");
  // console.log(req.flash("successEdit"))
  res.redirect(`${systemAdmin.prefixAdmin}/products`);
};

// [GET] admin/read/:id
module.exports.readProduct = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id
  }

  const product = await Products.findOne(find)

  res.render("admin/pages/products/readProduct.pug", {
    title: "Detail Product",
    product: product
  })
}