const { request } = require("express");
const Products = require("../../models/products.model");
const systemAdmin = require("../../config/system")
const filterStatusHelpers = require("../../helpers/admin/filterStatus");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");
const { prefixAdmin } = require("../../config/system");
const ProductsCategory = require("../../models/productsCategory.model");
const createTree = require("../../helpers/admin/createTree")

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
  const limit = req.query.limit
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
  const {sortKey, sortValue} = req.query;
  if(sortKey && sortValue) {
    sort[sortKey] = sortValue
  } else {
    sort.position = "desc"
  }

  // các sản phẩm trả về
  const products = await Products.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip);


  res.render("admin/pages/products/index2.pug", {
    title: "Trang danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    pagination: objPagination,
  });
};

// [PACTCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  await Products.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công !!");
  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [PACTCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // console.log(req.body);

  const { type, ids } = req.body;

  const arrIds = ids.split(",");

  if (ids) {
    if (type == "active") {
      await Products.updateMany({ _id: { $in: arrIds } }, { status: "active" });
      req.flash("success", "Cập nhật trạng thái thành công !!");
    } else if (type == "inactive") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { status: "inactive" }
      );
      req.flash('success', 'Cập nhật trạng thái thành công !!');
    } else if (type == "delete") {
      await Products.updateMany(
        { _id: { $in: arrIds } },
        { deleted: true, deleteAt: new Date() }
      );
      req.flash('success', 'Xoá sản phẩm thành công !!');
    } else if (type == "position") {
      for (const item of arrIds) {
        const [id, position] = item.split("-");
        position = parseInt(position);
        await Products.updateOne({ _id: id }, { position: position });
      }
    }
  }
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [PACTCH] admin/products/change-position/:id/:position
module.exports.changePosition = async (req, res) => {
  const id = req.params.id
  const position = parseInt(req.params.position)
  if(id && position) {
    await Products.updateOne({_id: id}, {position: position})
  }
  res.redirect(`${prefixAdmin}/products`)
}

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

  req.flash('success', 'Xoá sản phẩm thành công !!');
  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [GET] admin/products/create
module.exports.create = async (req, res) => {

  const find = {
    deleted: false
  }

  const records = await ProductsCategory.find(find);
  const newRecords = createTree(records)

  res.render("admin/pages/products/createProduct.pug", {
    title: "Thêm mới sản phẩm",
    newRecords: newRecords
  })
}

// [POST] admin/products/create
module.exports.createPost = async (req, res) => {
  // chuyển thành kiểu số nguyên
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)

  if(req.body.position) {
    req.body.position = parseInt(req.body.position)
  } else {
    const position = await Products.countDocuments();
    req.body.position = position + 1;
  }

  req.body.thumbnail = `/uploads/${req.file.filename}`

  const product = await Products(req.body);
  await product.save()

  res.redirect(`${systemAdmin.prefixAdmin}/products`);
}

// [GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {

  try {

    const find = {
      _id: req.params.id,
      deleted: false 
    }

    const findCategory = {
      deleted: false
    }
  
    const records = await ProductsCategory.find(findCategory);
    const newRecords = createTree(records)

    const product = await Products.findOne(find)
  
    res.render("admin/pages/products/editProduct.pug", {
      title: "Sửa mới sản phẩm",
      product: product,
      newRecords: newRecords
    })
    
  } catch (e) {
    res.redirect(`${systemAdmin.prefixAdmin}/products`)
  }

}

// [PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    console.log(req.body)
    // chuyển thành kiểu số nguyên
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)
  
    if(req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    await Products.updateOne({_id: req.params.id}, req.body)

    req.flash('success', 'Đã cập nhật thành công sản phẩm :)')
    res.redirect(`${systemAdmin.prefixAdmin}/products/edit/${req.params.id}`);
}

