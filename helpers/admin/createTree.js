const createTree = (arr, parent_Id = "") => {
  const tree = [];
    arr.forEach((item) => {
      if (String(item.parent_Id) === String(parent_Id)) {
        const children = createTree(arr, item.id);
        if (children.length) {
          item = item.toObject();
          item.children = children;
        }
        tree.push(item);
      }
    });
    return tree;
}

module.exports = createTree;