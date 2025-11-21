const systemAdmin = require("../../config/system");
const ProductsCategory = require("../../models/productsCategory.model");
const createTree = require("../../helpers/admin/createTree");
const filterStatusHelpers = require("../../helpers/admin/filterStatus");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");
const { prefixAdmin } = require("../../config/system");
const treeToFlatArray = require("../../helpers/admin/treeToPlatArray");
const cloudinary = require("../../config/cloudinary.config");
const uploadImage = require("../../helpers/admin/uploadImage");

// [GET] admin/products-category
module.exports.index = async (req, res) => {
  // Tìm kiếm sản phẩm
  let find = {
    deleted: false,
  };

  // Bộ lọc sản phẩm
  const filterStatus = filterStatusHelpers(req.query);

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm sản phẩm
  if (searchHelpers(req.query)) {
    find.title = searchHelpers(req.query);
  }

  // Phân trang
  const limit = req.query.limit;
  const countPage = await ProductsCategory.countDocuments(find);
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
    sort[sortKey] = sortValue;
  } else {
    sort.position = "desc";
  }

  // các sản phẩm trả về
  const record = await ProductsCategory.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip);

  // Query 2: Lấy "bản đồ" toàn bộ danh mục để tra cứu tổ tiên
  // Chỉ lấy id, title, parentId => Cực nhẹ
  const allCategories = await ProductsCategory.find({ deleted: false }).select(
    "_id title parentId"
  );

  // --- PHẦN 3: TẠO HÀM TRA CỨU ĐƯỜNG DẪN ---

  // Biến đổi mảng allCategories thành Object để tra cứu cho nhanh (O(1))
  // Kết quả dạng: { "id_abc": { title: "...", parentId: "..." }, ... }
  const dataMap = {};
  allCategories.forEach((item) => {
    dataMap[item.id] = item;
  });

  // Hàm đệ quy tìm cha từ dataMap (không cần query DB nữa)
  const getFullPath = (parentId, currentTitle) => {
    // Nếu có cha và cha tồn tại trong Map
    if (parentId && dataMap[parentId]) {
      const parent = dataMap[parentId];
      // Đệ quy tiếp để tìm ông nội
      return getFullPath(parent.parentId, parent.title) + " > " + currentTitle;
    }
    // Nếu không còn cha (đã tới Root)
    return currentTitle;
  };

  // --- PHẦN 4: GHÉP DỮ LIỆU ---
  const newRecord = record.map((item) => {
    const itemObj = item.toObject();
    // Gọi hàm tạo đường dẫn, truyền vào parentId và title hiện tại
    itemObj.fullPath = getFullPath(item.parentId, item.title);
    return itemObj;
  });

  res.render("admin/pages/productsCategory/index.pug", {
    title: "Product Category",
    newRecord: newRecord,
    filterStatus: filterStatus,
    pagination: objPagination,
    message: {
      successEdit: req.flash("successEdit"),
      successCreate: req.flash("successCreate"),
    },
  });
};

// [PATCH] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  await ProductsCategory.updateOne({ _id: id }, { status: status });

  req.flash("successStatus", "Update status success !!");
  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
};

// [PACTCH] admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  // console.log(req.body);

  let { type, ids } = req.body;

  let arrIds = ids.split(",");

  if (ids) {
    if (type == "active") {
      await ProductsCategory.updateMany(
        { _id: { $in: arrIds } },
        { status: "active" }
      );
      req.flash("successStatus", "Update status success !!");
    } else if (type == "inactive") {
      await ProductsCategory.updateMany(
        { _id: { $in: arrIds } },
        { status: "inactive" }
      );
      req.flash("successStatus", "Update status success !!");
    } else if (type == "delete") {
      await ProductsCategory.updateMany(
        { _id: { $in: arrIds } },
        { deleted: true, deleteAt: new Date() }
      );
      req.flash("successDelete", "Delete status success !!");
    } else if (type == "position") {
      for (let item of arrIds) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductsCategory.updateOne({ _id: id }, { position: position });
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
    await ProductsCategory.updateOne({ _id: id }, { position: position });
  }
  req.flash("successPosition", "Position update successful !!");
  res.redirect(`${prefixAdmin}/products-category`);
};

// [GET] admin/products-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  const record = await ProductsCategory.find(find);

  const newRecord = treeToFlatArray(record);

  res.render("admin/pages/productsCategory/createProductCategory.pug", {
    title: "Create Product Category",
    newRecord: newRecord,
  });
};

// [POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
  // --- 1. Xử lý logic Position (Vị trí) ---
  // Nếu người dùng không nhập vị trí, tự động tính toán tăng lên 1
  if (!req.body.position) {
    const count = await ProductsCategory.countDocuments({ deleted: false });
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // --- 2. Xử lý logic Image (Ảnh) ---
  // Chỉ upload khi có file, tránh lỗi crash server
  if (req.file) {
    req.body.thumbnail = await uploadImage(req.file);
  }

  // --- 3. Xử lý logic ParentId & Level (QUAN TRỌNG) ---
  if (req.body.parentId) {
    // Nếu có chọn cha: Tìm cha để lấy level của cha
    const parent = await ProductsCategory.findOne({
      _id: req.body.parentId,
      deleted: false
    });
    
    // Level con = Level cha + 1
    // (Thêm toán tử ? để an toàn: nếu lỡ ko tìm thấy cha thì mặc định là 1)
    req.body.level = parent ? parent.level + 1 : 1;
  } else {
    // Nếu không chọn cha (Root)
    req.body.parentId = null; // Đảm bảo parentId là null chứ không phải ""
    req.body.level = 1;
  }

  // --- 4. Lưu dữ liệu ---
  // Lúc này req.body đã đầy đủ và sạch sẽ, chỉ cần ném vào Model
  const record = new ProductsCategory(req.body);
  await record.save();

  req.flash("successCreate", "Success Create Product Category !");
  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
};

// // [PATCH] admin/product-category/change-status/:status/:id
// module.exports.changeStatus = async (req, res) => {
//   const { status, id } = req.params;
//   await ProductsCategory.updateOne({ _id: id }, { status: status });
//   res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
// };

// [DELETE] admin/product-category/delete-category/:id
module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  await ProductsCategory.updateOne({ _id: id }, { deleted: true });

  req.flash("successDelete", "Success Delete Product Category !")
  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
};

// [GET] admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    deleted: false,
  };

  const { id } = req.params;
  const productCategory = await ProductsCategory.findById(id);
  const records = await ProductsCategory.find(find);

  const newRecords = treeToFlatArray(records);

  res.render("admin/pages/productsCategory/editProductCategory.pug", {
    title: "Edit Product Category",
    productCategory: productCategory,
    newRecords: newRecords,
  });
};

// [PATCH] admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const { id } = req.params;

  if (req.file) {
    req.body.thumbnail = await uploadImage(req.file);
  }

  req.body.parentId = req.body.parentId === "" ? null : req.body.parentId

  await ProductsCategory.updateOne({ _id: id }, req.body);

  req.flash("successEdit", "Success Edit Product Category !")
  res.redirect(`${systemAdmin.prefixAdmin}/products-category`);
};

// [GET] admin/products-category/read/:id
module.exports.read = async (req, res) => {
  const find = {
    deleted: false,
  };

  const { id } = req.params;
  const productCategory = await ProductsCategory.findById(id);
  const records = await ProductsCategory.find(find);

  const newRecords = treeToFlatArray(records);

  res.render("admin/pages/productsCategory/readProductCategory.pug", {
    title: "Read Product Category",
    productCategory: productCategory,
    newRecords: newRecords,
  });
}