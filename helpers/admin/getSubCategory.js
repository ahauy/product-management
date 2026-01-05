const ProductsCategory = require("../../models/productsCategory.model");

module.exports = async (parentId) => {
  // Hàm đệ quy lấy tất cả danh mục con
  const getSubs = async (currentId) => {
    const subs = await ProductsCategory.find({
      parentId: currentId,
      deleted: false,
    });

    let allSub = [...subs];

    for (const sub of subs) {
      const children = await getSubs(sub.id); // Gọi lại chính nó để tìm cháu
      allSub = allSub.concat(children);
    }

    return allSub;
  };

  const result = await getSubs(parentId);
  return result;
};