// 2. Hàm đệ quy để tạo chuỗi đường dẫn: "Ông > Cha > Con"
  // Hàm này nhận vào 1 item và danh sách tổng, nó sẽ tìm cha của item đó
  const createPath = (currentItem, allItems) => {
    // Nếu không có cha (Level 1), trả về tên của nó
    if (!currentItem.parentId) {
      return currentItem.title;
    }

    // Tìm cha của item hiện tại trong danh sách
    // Lưu ý: so sánh String của ID
    const parent = allItems.find(item => item.id == currentItem.parentId);

    if (parent) {
      // Nếu tìm thấy cha, gọi lại hàm này cho cha (đệ quy) + tên hiện tại
      return createPath(parent, allItems) + " > " + currentItem.title;
    } else {
      // Trường hợp dữ liệu lỗi (có parentId nhưng không tìm thấy cha), trả về chính nó
      return currentItem.title;
    }
  };


module.exports = createPath