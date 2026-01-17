const systemAdmin = require("../../config/system");
const BlogCategory = require("../../models/blogCategory.model");
const createTree = require("../../helpers/admin/createTree");
const filterStatusHelpers = require("../../helpers/admin/filterStatus");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");
const { prefixAdmin } = require("../../config/system");
const treeToFlatArray = require("../../helpers/admin/treeToPlatArray");
const cloudinary = require("../../config/cloudinary.config");
const uploadImage = require("../../helpers/admin/uploadImage");
const Role = require("../../models/role.model");
const Accounts = require("../../models/accounts.model");
const pagination = require("../../helpers/admin/pagination");

// [GET] admin/blog-category/
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
  const countPage = await BlogCategory.countDocuments(find);
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
  const record = await BlogCategory.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip);

  // Query 2: Lấy "bản đồ" toàn bộ danh mục để tra cứu tổ tiên
  // Chỉ lấy id, title, parentId => Cực nhẹ
  const allCategories = await BlogCategory.find({ deleted: false }).select(
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

  for (let item of newRecord) {
    // 1. KIỂM TRA createdBy CÓ TỒN TẠI KHÔNG TRƯỚC KHI DÙNG
    if (item.createdBy && item.createdBy.accountId) {
      const accountCreate = await Accounts.findOne({
        _id: item.createdBy.accountId,
      });

      if (accountCreate) {
        const role = await Role.findOne({ _id: accountCreate.roleId });
        item.createdBy.fullName = accountCreate.fullName;
        item.createdBy.role = role ? role.title : ""; // Thêm check role tồn tại
      }
    } else {
      // Xử lý trường hợp sản phẩm cũ không có người tạo
      // Gán một object rỗng hoặc giá trị mặc định để bên view không bị lỗi
      item.createdBy = {
        fullName: "Không rõ",
        role: "",
      };
    }

    // 2. KIỂM TRA updatedBy CÓ TỒN TẠI KHÔNG
    if (item.updatedBy && item.updatedBy.length > 0) {
      let i = 0;
      for (let acc of item.updatedBy) {
        if (acc && acc.accountId) {
          // Kiểm tra kỹ từng phần tử
          const accUpdate = await Accounts.findOne({ _id: acc.accountId });
          if (accUpdate) {
            const role = await Role.findOne({ _id: accUpdate.roleId });
            item.updatedBy[i].fullName = accUpdate.fullName;
            item.updatedBy[i].role = role ? role.title : "";
          }
        }
        i++;
      }
    }

    // 3. KIỂM TRA deletedBy (Tương tự)
    if (item.deletedBy && item.deletedBy.accountId) {
      const accountDelete = await Accounts.findOne({
        _id: item.deletedBy.accountId,
      });
      if (accountDelete) {
        const role = await Role.findOne({ _id: accountDelete.roleId });
        item.deletedBy.fullName = accountDelete.fullName;
        item.deletedBy.role = role ? role.title : "";
      }
    }
  }

  res.render("admin/pages/blogCategory/index.pug", {
    title: "Blog Category", 
    newRecord: newRecord,
    filterStatus: filterStatus,
    pagination: objPagination,
  })
}

// [PATCH] admin/blog-category/change-status/:status/:id_abc
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  const token = req.cookies.token

  const account = await Accounts.findOne({ token: token });

  const updatedBy = {
    accountId: account._id,
    updatedAt: new Date(),
  };

  await BlogCategory.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("successStatus", "Update status success !!");
  res.redirect(`${systemAdmin.prefixAdmin}/blog-category`);
}

// [PACTCH] admin/blog-category/change-multi
module.exports.changeMulti = async (req, res) => {
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
      await BlogCategory.updateMany(
        { _id: { $in: arrIds } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash("successStatus", "Update status success !!");
    } else if (type == "inactive") {
      await BlogCategory.updateMany(
        { _id: { $in: arrIds } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash("successStatus", "Update status success !!");
    } else if (type == "delete") {
      await BlogCategory.updateMany(
        { _id: { $in: arrIds } },
        {
          deleted: true,
          deletedBy: {
            accountId: account._id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("successDelete", "Delete status success !!");
    } else if (type == "position") {
      for (let item of arrIds) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await BlogCategory.updateOne(
          { _id: id },
          { position: position, $push: { updatedBy: updatedBy } }
        );
      }
      req.flash("successPosition", "Position update success !!");
    }
  }
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
}

// [PATCH] admin/blog-category/change-position/:id/:position
module.exports.changePostition = async (req, res) => {
  const id = req.params.id;
  const position = parseInt(req.params.position);

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  const updatedBy = {
    accountId: account._id,
    updatedAt: new Date(),
  };

  if (id && position) {
    await BlogCategory.updateOne(
      { _id: id },
      { position: position, $push: { updatedBy: updatedBy } }
    );
  }
  req.flash("successPosition", "Position update successful !!");
  res.redirect(`${prefixAdmin}/blog-category`);
}

// [GET] admin/blog-category/create
module.exports.getCreate = async (req, res) => {
  const find = {
    deleted: false,
  };

  const record = await BlogCategory.find(find);

  const newRecord = treeToFlatArray(record);

  res.render("admin/pages/blogCategory/createBlogCategory.pug", {
    title: "Create Blog Category",
    newRecord: newRecord,
  });
}

// [POST] admin/blog-category/create
module.exports.postCreate = async (req, res) => {
  // --- 1. Xử lý logic Position (Vị trí) ---
  // Nếu người dùng không nhập vị trí, tự động tính toán tăng lên 1
  if (!req.body.position) {
    const count = await BlogCategory.countDocuments({ deleted: false });
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
    const parent = await BlogCategory.findOne({
      _id: req.body.parentId,
      deleted: false,
    });

    // Level con = Level cha + 1
    // (Thêm toán tử ? để an toàn: nếu lỡ ko tìm thấy cha thì mặc định là 1)
    req.body.level = parent ? parent.level + 1 : 1;
  } else {
    // Nếu không chọn cha (Root)
    req.body.parentId = null; // Đảm bảo parentId là null chứ không phải ""
    req.body.level = 1;
  }

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  req.body.createdBy = {
    accountId: account._id,
    createdAt: new Date(),
  };

  // --- 4. Lưu dữ liệu ---
  // Lúc này req.body đã đầy đủ và sạch sẽ, chỉ cần ném vào Model
  const record = new BlogCategory(req.body);
  await record.save();

  req.flash("successCreate", "Success Create Blog Category !");
  res.redirect(`${systemAdmin.prefixAdmin}/blog-category`);
}

// [DELETE] admin/blog-category/delete-category/:id
module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  await BlogCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        accountId: account._id,
        deletedAt: new Date(),
      },
    }
  );

  req.flash("successDelete", "Success Delete Product Category !");
  res.redirect(`${systemAdmin.prefixAdmin}/blog-category`);
}

// [GET] admin/blog-category/edit/:id
module.exports.getEdit = async (req, res) => {
  const find = {
    deleted: false,
  };

  const { id } = req.params;
  const blogCategory = await BlogCategory.findById(id);
  const records = await BlogCategory.find(find);

  const newRecords = treeToFlatArray(records);

  res.render("admin/pages/blogCategory/editBlogCategory.pug", {
    title: "Edit Blog Category",
    blogCategory: blogCategory,
    newRecords: newRecords,
  });
}

// [PATCH] admin/blog-category/edit/:id_abc
module.exports.patchEdit = async (req, res) => {
  const { id } = req.params;

  if (req.file) {
    req.body.thumbnail = await uploadImage(req.file);
  }

  req.body.parentId = req.body.parentId === "" ? null : req.body.parentId;

  const token = req.cookies.token
  const account = await Accounts.findOne({token: token})

  req.body.updatedBy = {
    accountId: account._id,
    updatedAt: new Date()
  }

  await BlogCategory.updateOne({ _id: id }, req.body);

  req.flash("successEdit", "Success Edit Blog Category !");
  res.redirect(`${systemAdmin.prefixAdmin}/blog-category`);
}

// [GET] admin/blog-category/read/:id
module.exports.getRead = async (req, res) => {
  const { id } = req.params;
  const blogCategory = await BlogCategory.findById(id);
  const records = await BlogCategory.find({});

  const newRecords = treeToFlatArray(records);

  res.render("admin/pages/blogCategory/readBlogCategory.pug", {
    title: "Read Blog Category",
    blogCategory: blogCategory,
    newRecords: newRecords,
  });
}

// [GET] admin/blog-category/trash
module.exports.getTrash = async (req, res) => {
  // Tìm kiếm sản phẩm
  let find = {
    deleted: true
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
  const countPage = await BlogCategory.countDocuments(find);
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
  const record = await BlogCategory.find(find)
    .sort(sort)
    .limit(objPagination.limitItem)
    .skip(objPagination.skip);

  // Query 2: Lấy "bản đồ" toàn bộ danh mục để tra cứu tổ tiên
  // Chỉ lấy id, title, parentId => Cực nhẹ
  const allCategories = await BlogCategory.find({ deleted: false }).select(
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

  for (let item of newRecord) {
    // 1. KIỂM TRA createdBy CÓ TỒN TẠI KHÔNG TRƯỚC KHI DÙNG
    if (item.createdBy && item.createdBy.accountId) {
      const accountCreate = await Accounts.findOne({
        _id: item.createdBy.accountId,
      });

      if (accountCreate) {
        const role = await Role.findOne({ _id: accountCreate.roleId });
        item.createdBy.fullName = accountCreate.fullName;
        item.createdBy.role = role ? role.title : ""; // Thêm check role tồn tại
      }
    } else {
      // Xử lý trường hợp sản phẩm cũ không có người tạo
      // Gán một object rỗng hoặc giá trị mặc định để bên view không bị lỗi
      item.createdBy = {
        fullName: "Không rõ",
        role: "",
      };
    }

    // 2. KIỂM TRA updatedBy CÓ TỒN TẠI KHÔNG
    if (item.updatedBy && item.updatedBy.length > 0) {
      let i = 0;
      for (let acc of item.updatedBy) {
        if (acc && acc.accountId) {
          // Kiểm tra kỹ từng phần tử
          const accUpdate = await Accounts.findOne({ _id: acc.accountId });
          if (accUpdate) {
            const role = await Role.findOne({ _id: accUpdate.roleId });
            item.updatedBy[i].fullName = accUpdate.fullName;
            item.updatedBy[i].role = role ? role.title : "";
          }
        }
        i++;
      }
    }

    // 3. KIỂM TRA deletedBy (Tương tự)
    if (item.deletedBy && item.deletedBy.accountId) {
      const accountDelete = await Accounts.findOne({
        _id: item.deletedBy.accountId,
      });
      if (accountDelete) {
        const role = await Role.findOne({ _id: accountDelete.roleId });
        item.deletedBy.fullName = accountDelete.fullName;
        item.deletedBy.role = role ? role.title : "";
      }
    }
  }

  res.render("admin/pages/blogCategory/trash.pug", {
    title: "Trash Blog Category",
    newRecord: newRecord,
    filterStatus: filterStatus,
    pagination: objPagination,
  });
}

// [PATCH] admin/blog-category/trash/change-multi
module.exports.trashChangeMulti = async (req, res) => {
  let { type, ids } = req.body;

  let arrIds = ids.split(",");

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  if (ids) {
    if (type == "delete") {
      await BlogCategory.deleteMany({ _id: { $in: arrIds } });
      req.flash("success", "Delete success !!");
    } else if (type == "restore") {
      await BlogCategory.updateMany(
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
}

// [DELETE] admin/blog-category/trash/delete-category
module.exports.trashDeleteBlog = async (req, res) => {
  const id = req.params.id;

  await BlogCategory.deleteOne({ _id: id });

  
  req.flash("success", "Delete Blog Category Success !!");

  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
}

// [PATCH] admin/blog-category/trash/restore-category
module.exports.trashRestoreBlog = async (req, res) => {
  const id = req.params.id;
  const token = req.cookies.token;
  // let isRestore = true; // vẫn có thể restore sản phẩm

  const account = await Accounts.findOne({ token: token });


  if (id) {
    await BlogCategory.updateOne(
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
    req.flash("successRestore", "Success Restore Category!");
    res.redirect(`${systemAdmin.prefixAdmin}/blog-category`);
  } else {
    req.flash("error", "Restore Error");
    const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
    res.redirect(backURL);
  }
}