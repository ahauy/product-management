// Tìm tất cả các ô input nhập số lượng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");

if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product-id");
      const quantity = parseInt(input.value);

      // Kiểm tra nếu số lượng hợp lệ (lớn hơn 0)
      if (quantity > 0) {
        // Chuyển hướng trình duyệt đến link cập nhật
        // Trình duyệt sẽ gửi yêu cầu GET đến server
        window.location.href = `/cart/update/${productId}/${quantity}`;
      } else {
        alert("Số lượng phải lớn hơn hoặc bằng 1");
        input.value = 1; // Reset về 1 nếu người dùng nhập số âm hoặc 0
      }
    });
  });
}

// Xử lý nút Trừ (-)
const buttonsMinus = document.querySelectorAll(".btMinus");
if (buttonsMinus.length > 0) {
  buttonsMinus.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input[name='quantity']");
      const quantity = parseInt(input.value);
      if (quantity > 1) {
        const productId = input.getAttribute("product-id");
        window.location.href = `/cart/update/${productId}/${quantity - 1}`;
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
      const quantity = parseInt(input.value);
      
      window.location.href = `/cart/update/${productId}/${quantity + 1}`;
    });
  });
}