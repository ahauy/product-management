const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blogCategory.model");
const Accounts = require("../../models/accounts.model");
const treeToFlatArray = require("../../helpers/admin/treeToPlatArray.js");
const cloudinary = require("../../config/cloudinary.config");
const uploadImage = require("../../helpers/admin/uploadImage");
const { prefixAdmin } = require("../../config/system");

// [GET] admin/blog/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const blogs = await Blog.find(find).populate(
    "createdBy.accountId",
    "fullName"
  );

  console.log(blogs);

  res.render("admin/pages/blog/index.pug", {
    title: "Page Blog",
    blog: blogs,
  });
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

    // Kiểm tra xem có nhập ngày hay chưa
    if (!req.body.date_client) {
      req.body.date_client = new Date();
    }

    if (req.body.blog_category) {
      // trả về danh sách các blog_category
      const arr = req.body.blog_category.split(",");

      // xử lý để bỏ "--" trước các category
      const arrObj = arr.map((ele) => {
        let [id, title] = ele.split("/");
        title = title.split("-- ").pop(); // trả về title category không có "--"
        return {
          categoryId: id,
          title: title,
        };
      });
      req.body.blog_category = arrObj;
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

    if (req.body.status === "publish") {
      req.body.publishedAt = new Date();
    }

    // gán position
    if (!req.body.position) {
      const count = await Blog.countDocuments({
        deleted: false,
        status: { $ne: "draft" }, // $ne nghĩa là "Not Equal" (Khác)
      });

      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
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
