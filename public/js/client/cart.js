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


// --- LOGIC TỰ ĐỘNG ĐIỀN LẠI FORM (AUTO FILL) ---
$(document).ready(function() {
  
  // 1. Hàm lấy Cookie (Helper function)
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // 2. Kiểm tra xem có Cookie dữ liệu cũ không
  const dataCookie = getCookie("data_fill_form");

  if (dataCookie) {
    console.log("Tìm thấy dữ liệu cũ, đang khôi phục...");
    try {
      // Giải mã Base64 -> JSON String -> Object
      // Vì lúc gửi đi ta dùng Buffer.from(...).toString('base64')
      // Nên lúc nhận về phải giải mã tương ứng:
      const jsonString = decodeURIComponent(escape(window.atob(dataCookie)));
      const data = JSON.parse(jsonString);
      
      const info = data.userInfo;
      const note = data.note;
      
      // 3. Điền lại vào các ô Input (Sử dụng jQuery)
      if(info) {
        $('input[name="fullName"]').val(info.fullName);
        $('input[name="email"]').val(info.email);
        $('input[name="phone"]').val(info.phone);
        $('input[name="address"]').val(info.address);
        
        // --- Xử lý phần Tỉnh/Huyện/Xã (Nâng cao) ---
        // Vì Select2 cần thời gian để load API, ta cần set value và trigger change
        // Nếu bạn thấy khó quá có thể bỏ qua phần này, khách chọn lại địa chỉ cũng được.
        // Nhưng nếu muốn xịn thì làm như sau:
        
        /* Ví dụ logic khôi phục địa chỉ (nếu cần):
           Nếu select option đã có sẵn thì .val().trigger('change')
           Nếu chưa có option (do load API) thì phải tạo option giả rồi append vào.
        */
      }
      
      if(note) {
        $('textarea[name="note"]').val(note);
      }

      // 4. Xóa Cookie đi (để F5 lại trang nó không tự điền nữa)
      // Đặt ngày hết hạn về quá khứ
      document.cookie = "data_fill_form=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    } catch (e) {
      console.log("Lỗi khôi phục form:", e);
    }
  }
});