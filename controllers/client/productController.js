const Products = require('../../models/products.model');
const ProductsCategory = require('../../models/productsCategory.model');
const formatMoney = require('../../helpers/client/formatMoney');
const createTreeHelper = require("../../helpers/client/createTree");

// [GET] products/:slugCategory
module.exports.productsCategory = async (req, res) => {
  try {
    // --- PHẦN 1: LẤY MENU BÊN NGOÀI (GIỮ NGUYÊN) ---
    const find = {
      deleted: false,
      status: "active",
    };
    const records = await ProductsCategory.find(find);
    const newRecords = createTreeHelper(records);

    // --- PHẦN 2: XỬ LÝ LOGIC LẤY SẢN PHẨM ---
    
    // 1. Lấy thông tin danh mục hiện tại từ slug
    const slugCategory = req.params.slugCategory;
    const category = await ProductsCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active" // Nên thêm check status
    });

    // Nếu không tìm thấy danh mục thì return hoặc chuyển trang 404
    if (!category) {
        return res.redirect("/"); 
    }

    // 2. Hàm đệ quy để lấy tất cả danh mục con (Sub-categories)
    // Mục đích: Nếu khách ấn vào "NAM" -> Phải lấy cả ID của "Áo nam", "Quần nam"...
    const getSubCategory = async (parentId) => {
        const subs = await ProductsCategory.find({
            parentId: parentId,
            deleted: false,
            status: "active"
        });

        let allSubs = [...subs];

        // Dùng vòng lặp để tìm sâu hơn (Level 3, Level 4...)
        for (const sub of subs) {
            const childs = await getSubCategory(sub.id);
            allSubs = allSubs.concat(childs);
        }
        return allSubs;
    };

    // 3. Thực hiện lấy danh sách danh mục con
    const listSubCategory = await getSubCategory(category.id);
    
    // 4. Tạo mảng chứa ID của danh mục cha + tất cả danh mục con
    const listSubCategoryId = listSubCategory.map(item => item.id);
    listSubCategoryId.push(category.id); // Thêm chính nó vào

    // 5. Truy vấn sản phẩm với toán tử $in
    const products = await Products.find({
      deleted: false,
      status: "active",
      category: { $in: listSubCategoryId } // <--- QUAN TRỌNG: Tìm category nằm trong danh sách ID
    }).sort({ position: -1 }); // (Tùy chọn) Sắp xếp mới nhất lên đầu


    res.render("client/pages/products/index.products.pug", {
      titlePage: category.title, // Title page động theo danh mục
      category: category,
      products: products,
      formatMoney: formatMoney,
      layoutProductsCategory: newRecords,
    });

  } catch (error) {
    console.error("Lỗi lấy sản phẩm theo danh mục:", error);
    res.redirect("back");
  }
}

// [GET] products/:slugProduct
module.exports.productDetail = async (req, res) => {

  // --- PHẦN 1: LẤY MENU BÊN NGOÀI (GIỮ NGUYÊN) ---
  const find = {
    deleted: false,
    status: "active",
  };
  const records = await ProductsCategory.find(find);
  const newRecords = createTreeHelper(records);

  // tìm các sản phẩm nổi bật
  const findFeatured = {
    deleted: false,
    featured: true,
    status: 'active',
  }

  // tìm sản phẩm 
  const findProduct = {
    deleted: false,
    status: "active",
    slug: req.params.slugProduct,
  }

  const product = await Products.findOne(findProduct)
  
  const sizes = []; // danh sách các size
  let stock = 0; // tổng số lượng sản phẩm
  product.variants.forEach(variant => {
    stock += variant.stock;
    sizes.push(variant.size)
  })


  const productsFeatured = await Products.find(findFeatured).limit(4);

  res.render('client/pages/products/detail.products.pug', {
    productsFeatured: productsFeatured,
    formatMoney: formatMoney,
    layoutProductsCategory: newRecords,
    product: product,
    stock: stock,
    sizes: sizes,
  })
}