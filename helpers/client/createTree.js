// helpers/createTree.js
let count = 0;

// SỬA: Đổi parentId = "" thành parentId = null
const createTree = (arr, parentId = null) => {
  const tree = [];
  arr.forEach((item) => {
    // So sánh item.parentId với parentId truyền vào
    // Lưu ý: item.parentId trong DB có thể là ObjectId, nên ta so sánh lỏng (==) hoặc chuyển về String
    if (item.parentId == parentId) {
      const newItem = item;
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

module.exports = (records) => {
  count = 0;
  // Khi gọi lần đầu, không truyền tham số thứ 2, nó sẽ lấy default là null
  const tree = createTree(records);
  return tree;
};