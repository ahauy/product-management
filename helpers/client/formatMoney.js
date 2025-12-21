module.exports = (number) => {
  // Sử dụng toLocaleString của JS để tự động thêm dấu chấm phân cách
  // Ví dụ: 100000 -> "100.000"
  if (typeof number !== 'number') return "0";
  return number.toLocaleString('vi-VN') + ' đ';
};