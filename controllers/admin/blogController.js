const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blogCategory.model");
const Accounts = require("../../models/accounts.model");
const Role = require("../../models/role.model.js");
const treeToFlatArray = require("../../helpers/admin/treeToPlatArray.js");
const cloudinary = require("../../config/cloudinary.config");
const uploadImage = require("../../helpers/admin/uploadImage");
const getSubCategory = require("../../helpers/admin/getSubCategory");
const searchHelpers = require("../../helpers/admin/search");
const paginationHelpers = require("../../helpers/admin/pagination");
const systemAdmin = require("../../config/system");

// [GET] admin/blog/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  // Lọc theo danh mục
  const records = await BlogCategory.find(find);
  const newRecords = treeToFlatArray(records);

  if (req.query.category) {
    // 1. Lấy tất cả danh mục con của danh mục đang chọn
    const listSubCategory = await getSubCategory(req.query.category);

    // 2. Tạo mảng chứa ID của danh mục cha + tất cả ID con cháu
    const listSubCategoryId = listSubCategory.map((item) => item.id);

    // Đừng quên push chính cái ID cha đang chọn vào mảng
    listSubCategoryId.push(req.query.category);

    // 3. Dùng toán tử $in để tìm sản phẩm thuộc bất kỳ ID nào trong mảng trên
    find.blog_category = { $in: listSubCategoryId };
  }

  // tìm kiếm sản phẩm
  if (searchHelpers(req.query)) {
    find.title = searchHelpers(req.query);
  }

  // lọc theo status
  if (req.query.status) {
    find.status = req.query.status.toLowerCase();
  }

  // lọc theo featured
  if (req.query.featured) {
    find.featured = req.query.featured;
  }

  // sắp xếp sản phẩm
  const sort = {};
  const { sortKey, sortValue } = req.query;
  if (sortKey && sortValue) {
    if (sortValue == "desc") {
      sort.createdAt = -1;
    } else {
      sort.createdAt = 1;
    }
  } else {
    sort.createdAt = -1;
  }

  // Phân trang
  const limit = req.query.limit;
  const countPage = await Blog.countDocuments(find);
  const objPagination = paginationHelpers(
    req.query,
    {
      limitItem: limit == undefined ? 4 : limit,
      currentPage: 1,
    },
    countPage
  );

  // các sản phẩm thoả mãn
  const blogs = await Blog.find(find)
    .populate({
      path: "createdBy.accountId",
      select: "fullName roleId",
      populate: {
        path: "roleId",
        select: "title",
      },
    })
    .limit(objPagination.limitItem)
    .skip(objPagination.skip)
    .sort(sort)
    .lean();

  for (let blog of blogs) {
    // 1. KIỂM TRA createdBy CÓ TỒN TẠI KHÔNG TRƯỚC KHI DÙNG
    if (blog.createdBy && blog.createdBy.accountId) {
      // Gán trực tiếp thông tin vào vị trí bạn muốn
      blog.createdBy.fullName = blog.createdBy.accountId.fullName;
      blog.createdBy.role = blog.createdBy.accountId.roleId
        ? blog.createdBy.accountId.roleId.title
        : "";
    } else {
      // Xử lý trường hợp sản phẩm cũ không có người tạo
      // Gán một object rỗng hoặc giá trị mặc định để bên view không bị lỗi
      blog.createdBy = {
        fullName: "Không rõ",
        role: "",
      };
    }

    // 2. KIỂM TRA updatedBy CÓ TỒN TẠI KHÔNG
    if (blog.updatedBy && blog.updatedBy.length > 0) {
      let i = 0;
      for (let acc of blog.updatedBy) {
        if (acc && acc.accountId) {
          // Kiểm tra kỹ từng phần tử
          const accUpdate = await Accounts.findOne({ _id: acc.accountId });
          if (accUpdate) {
            const role = await Role.findOne({ _id: accUpdate.roleId });
            blog.updatedBy[i].fullName = accUpdate.fullName;
            blog.updatedBy[i].role = role ? role.title : "";
          }
        }
        i++;
      }
    }

    // 3. KIỂM TRA deletedBy (Tương tự)
    if (blog.deletedBy && blog.deletedBy.accountId) {
      const accountDelete = await Accounts.findOne({
        _id: blog.deletedBy.accountId,
      });
      if (accountDelete) {
        const role = await Role.findOne({ _id: accountDelete.roleId });
        blog.deletedBy.fullName = accountDelete.fullName;
        blog.deletedBy.role = role ? role.title : "";
      }
    }
  }

  res.render("admin/pages/blog/index.pug", {
    title: "Page Blog",
    blogs: blogs,
    totalBlogs: countPage,
    pagination: objPagination,
    newRecords: newRecords,
  });
};

// [PATCH] admin/blog/change-featured/:featured/:id
module.exports.changeFeatured = async (req, res) => {
  const { featured, id } = req.params;

  const token = req.cookies.token;
  const account = await Accounts.findOne({ token: token });

  const updatedBy = {
    accountId: account._id,
    updatedAt: new Date(),
  };

  await Blog.updateOne(
    { _id: id },
    { featured: featured, $push: { updatedBy: updatedBy } }
  );

  req.flash("successStatus", "Update featured success !!");
  // res.redirect(`/admin/products/`)
  const backURL = req.header("Referer") || "/"; // fallback về trang chủ nếu không có Referer
  res.redirect(backURL);
};

// [GET] admin/blog/create
module.exports.getCreate = async (req, res) => {
  const findCategory = {
    deleted: false,
    status: "active",
  };

  const record = await BlogCategory.find(findCategory);
  const newRecord = treeToFlatArray(record);

  res.render("admin/pages/blog/createBlog.pug", {
    title: "Create Blog",
    newRecord: newRecord,
  });
};

// [POST] admin/blog/create/:status
module.exports.postCreate = async (req, res) => {
  try {
    // Gán trạng thái của bải viết
    const status = req.params.status;
    req.body.status = status;

    // Chỉ upload khi có file, tránh lỗi crash server
    if (req.file) {
      req.body.thumbnail = await uploadImage(req.file);
    }

    // // Kiểm tra xem có nhập ngày hay chưa
    // if (!req.body.date_client) {
    //   req.body.date_client = new Date();
    // }

    if (req.body.blog_category !== "") {
      // Dùng toString() để chắc chắn nó là string trước khi split
      const categoryString = req.body.blog_category.toString();

      // Chỉ xử lý nếu chuỗi không rỗng
      if (categoryString.trim() !== "") {
        const arr = categoryString.split(",");

        const arrObj = arr
          .map((ele) => {
            const parts = ele.split("/");
            // Kiểm tra kỹ xem có đủ phần tử không để tránh lỗi undefined
            if (parts.length >= 2) {
              const id = parts[0];
              let title = parts[1];
              // title = title.split("-- ").pop();
              return {
                categoryId: id,
                title: title,
              };
            }
            return null; // Trả về null nếu dữ liệu lỗi
          })
          .filter((item) => item !== null); // Loại bỏ các item lỗi

        req.body.blog_category = arrObj;
      }
    }

    // xem ngưởi tạo là ai?
    const token = req.cookies.token;
    if (token) {
      const account = await Accounts.findOne({ token: token });

      req.body.createdBy = {
        accountId: account.id,
        createAt: new Date(),
      };
    }

    if (req.body.status == "publish") {
      req.body.publishedAt = new Date();
    } else {
      req.body.publishedAt = null;
    }

    const blog = new Blog(req.body);
    await blog.save();

    req.flash("success", "Create Blog Success !");
    res.redirect(`${systemAdmin.prefixAdmin}/blog`);
  } catch (e) {
    req.flash("error", "Create Blog Error !");
    res.redirect(`${systemAdmin.prefixAdmin}/blog`);
  }
};

// [DELETE] admin/delete-blog/:id
module.exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.cookies.token;
    const account = await Accounts.findOne({ token: token });

    await Blog.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedBy: {
          accountId: account._id,
          deletedAt: new Date(),
        },
      }
    );

    req.flash("success", "Success Blog Delete !!");
    res.redirect(`${systemAdmin.prefixAdmin}/blog`);
  } catch (e) {
    req.flash("error", "Error Blog Delete !!");
    res.redirect(`${systemAdmin.prefixAdmin}/blog`);
  }
};

// [GET] admin/blog/read/:id
module.exports.getRead = async (req, res) => {
  const id = req.params.id;

  const find = {
    _id: id,
    deleted: false,
  };

  const blog = await Blog.findOne(find);

  res.render("admin/pages/blog/readBlog.pug", {
    blog: blog,
  });
};

// [GET] /admin/blog/create/:ID
module.exports.getEdit = async (req, res) => {
  const id = req.params.id;

  const find = {
    _id: id,
    deleted: false,
  };

  const findCategory = {
    deleted: false,
    status: "active",
  };

  const record = await BlogCategory.find(findCategory);
  const newRecord = treeToFlatArray(record);

  const blog = await Blog.findOne(find);

  res.render("admin/pages/blog/editBlog.pug", {
    blog: blog,
    title: "Edit Blog",
    newRecord: newRecord,
  });
};

// [PATCH] admin/blog/edit/:id
module.exports.patchEdit = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Kiểm tra tài khoản trước
    const token = req.cookies.token;
    const account = await Accounts.findOne({ token: token });

    if (!account) {
      req.flash("error", "Vui lòng đăng nhập lại!");
      return res.redirect("/admin/auth/logout");
    }

    // sửa phần blog_category
    if (req.body.blog_category !== "") {
      // Dùng toString() để chắc chắn nó là string trước khi split
      const categoryString = req.body.blog_category.toString();

      // Chỉ xử lý nếu chuỗi không rỗng
      if (categoryString.trim() !== "") {
        const arr = categoryString.split(",");

        const arrObj = arr
          .map((ele) => {
            const parts = ele.split("/");
            // Kiểm tra kỹ xem có đủ phần tử không để tránh lỗi undefined
            if (parts.length >= 2) {
              const id = parts[0];
              let title = parts[1];
              // title = title.split("-- ").pop();
              return {
                categoryId: id,
                title: title,
              };
            }
            return null; // Trả về null nếu dữ liệu lỗi
          })
          .filter((item) => item !== null); // Loại bỏ các item lỗi

        req.body.blog_category = arrObj;
      }
    }

    // 2. Thực hiện Update
    await Blog.updateOne(
      {
        _id: id,
      },
      {
        $set: req.body,
        $push: {
          updatedBy: {
            accountId: account._id,
            updatedAt: new Date(),
          },
        },
      }
    );

    req.flash("success", "Lưu bài viết thành công!");
    res.redirect(`${systemAdmin.prefixAdmin}/blog`);
  } catch (error) {
    console.log(error)
    req.flash("error", "Cập nhật thất bại!");
    res.redirect(`${systemAdmin.prefixAdmin}/blog`);
  }
};

// [PATCH] admin/blog/:id/:status
module.exports.patchEditStatus = async (req, res) => {
  try {
    const { id, status } = req.params;

    const token = req.cookies.token;
    const account = await Accounts.findOne({ token: token });

    if (!account) {
      req.flash("error", "Vui lòng đăng nhập lại!");
      return res.redirect("/admin/auth/logout");
    }

    // update status - gán status vào trong req.body
    req.body.status = status;

    // sửa phần blog_category
    if (req.body.blog_category !== "") {
      // Dùng toString() để chắc chắn nó là string trước khi split
      const categoryString = req.body.blog_category.toString();

      // Chỉ xử lý nếu chuỗi không rỗng
      if (categoryString.trim() !== "") {
        const arr = categoryString.split(",");

        const arrObj = arr
          .map((ele) => {
            const parts = ele.split("/");
            // Kiểm tra kỹ xem có đủ phần tử không để tránh lỗi undefined
            if (parts.length >= 2) {
              const id = parts[0];
              let title = parts[1];
              // title = title.split("-- ").pop();
              return {
                categoryId: id,
                title: title,
              };
            }
            return null; // Trả về null nếu dữ liệu lỗi
          })
          .filter((item) => item !== null); // Loại bỏ các item lỗi

        req.body.blog_category = arrObj;
      }
    }

    // 2. Thực hiện Update
    await Blog.updateOne(
      {
        _id: id,
      },
      {
        $set: req.body,
        $push: {
          updatedBy: {
            accountId: account._id,
            updatedAt: new Date(),
          },
        },
      }
    );

    if(req.body.status === "publish") {
      req.flash("success", "Bài viết đã được đăng lên thành công !");
    }

    if(req.body.status === "conceal") {
      req.flash("warning", "Bài viết đã được chuyển về trạng thái ẩn !");
    }

    if(req.body.status === "pending") {
      req.flash("success", "Bài viết đang được phê duyệt !");
    }

    if(req.body.status === "draft") {
      req.flash("success", "Lưu bản nháp thành công !");
    }
    
    res.redirect(`${systemAdmin.prefixAdmin}/blog`);
  } catch (e) {
    req.flash("error", "Cập nhật thất bại!");
    res.redirect(`${systemAdmin.prefixAdmin}/blog`);
  }
};
