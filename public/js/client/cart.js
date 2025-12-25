// Tìm tất cả các ô input nhập số lượng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");

if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product-id");
      const productSize = input.getAttribute("product-size");
      const quantity = parseInt(input.value);

      // Kiểm tra nếu số lượng hợp lệ (lớn hơn 0)
      if (quantity > 0) {
        // Chuyển hướng trình duyệt đến link cập nhật
        // Trình duyệt sẽ gửi yêu cầu GET đến server
        window.location.href = `/cart/update/${productId}/${quantity}/${productSize}`;
      } else {
        window.location.href = `/cart/delete/${productId}/${productSize}`
      }
    });
  });
}

// Xử lý nút Trừ (-)
// Xử lý nút Trừ (-)
const buttonsMinus = document.querySelectorAll(".btMinus");
if (buttonsMinus.length > 0) {
  buttonsMinus.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input[name='quantity']");
      const quantity = parseInt(input.value);
      
      // --- SỬA LẠI: Lấy thông tin ID và Size ra ngoài trước khi kiểm tra số lượng ---
      const productId = input.getAttribute("product-id");
      const productSize = input.getAttribute("product-size");

      if (quantity > 1) {
        // Trường hợp giảm số lượng
        window.location.href = `/cart/update/${productId}/${quantity - 1}/${productSize}`;
      } else {
        // Trường hợp xóa sản phẩm (khi quantity = 1)
        // Lúc này biến productId và productSize đã tồn tại và hoạt động đúng
        window.location.href = `/cart/delete/${productId}/${productSize}`
      }
    });
  });
}

// Xử lý nút Cộng (+)
const buttonsPlus = document.querySelectorAll(".btnPlus");
if (buttonsPlus.length > 0) {
  buttonsPlus.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input[name='quantity']");
      const productId = input.getAttribute("product-id");
      const productSize = input.getAttribute("product-size");
      const quantity = parseInt(input.value);
      
      window.location.href = `/cart/update/${productId}/${quantity + 1}/${productSize}`;
    });
  });
}