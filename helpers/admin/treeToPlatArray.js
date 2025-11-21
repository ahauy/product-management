module.exports.treeToFlatArray = (items, parentId = null, level = 1, result = []) => {
  items.forEach((item) => {
    // Kiểm tra xem item này có phải là con của parentId đang xét không
    const isChild = item.parentId == parentId; 
    
    if (isChild) {
      // --- ĐOẠN XỬ LÝ PREFIX MỚI ---
      // Giải thích logic:
      // Level 1: Array(1).join -> Tạo mảng 1 phần tử rỗng -> join ra chuỗi rỗng "" (Đúng ý bạn: Root không có gạch)
      // Level 2: Array(2).join -> Tạo mảng 2 phần tử rỗng -> join ra "-- " (1 lần gạch)
      // Level 3: Array(3).join -> join ra "-- -- " (2 lần gạch)
      const prefix = Array(level).join("-- ");
      
      const newItem = item.toObject ? item.toObject() : item;
      
      // Gán prefix vào để hiển thị
      newItem.prefixTitle = `${prefix}${newItem.title}`;
      
      // Đẩy vào mảng kết quả
      result.push(newItem);

      // Gọi đệ quy: Tăng level lên 1 cho lớp con tiếp theo
      module.exports.treeToFlatArray(items, item.id, level + 1, result);
    }
  });
  
  return result;
};