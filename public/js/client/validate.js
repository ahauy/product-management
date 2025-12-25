// Hàm regex kiểm tra email
const isEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Hàm regex kiểm tra số điện thoại (Việt Nam)
const isPhone = (phone) => {
  return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone);
};

// --- HÀM HIỂN THỊ LỖI ---
// inputElement: thẻ input đang gõ
// message: nội dung lỗi muốn hiện
const showError = (inputElement, message) => {
  const parent = inputElement.parentElement; // Lấy thẻ div .input-group
  const errorElement = parent.querySelector(".error-message");

  parent.classList.add("error"); // Thêm class để CSS làm đỏ viền
  errorElement.innerText = message; // Gán nội dung lỗi
};

// --- HÀM XÓA LỖI ---
const showSuccess = (inputElement) => {
  const parent = inputElement.parentElement;
  const errorElement = parent.querySelector(".error-message");

  parent.classList.remove("error"); // Gỡ bỏ viền đỏ
  errorElement.innerText = ""; // Xóa nội dung lỗi
};

// --- HÀM KIỂM TRA RỖNG ---
const checkRequired = (listInput) => {
  let isRequired = true;
  listInput.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `Vui lòng nhập thông tin này`);
      isRequired = false;
    } else {
      showSuccess(input);
    }
  });
  return isRequired;
};

// --- LOGIC CHÍNH ---
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#form-register form");

  if (registerForm) {
    const fullName = registerForm.querySelector('input[name="fullName"]');
    const phone = registerForm.querySelector('input[name="phone"]');
    const email = registerForm.querySelector('input[name="email"]');
    const password = registerForm.querySelector('input[name="password"]');
    const confirmPassword = registerForm.querySelector(
      'input[name="confirmPassword"]'
    );
    const btnSubmit = registerForm.querySelector("button");

    // Danh sách các input cần check rỗng
    const inputs = [fullName, phone, email, password, confirmPassword];

    // 1. Xử lý sự kiện BLUR (Rời khỏi ô input thì check lỗi ngay)
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value.trim() === "") {
          showError(this, "Không được để trống trường này");
        }
      });
      // Khi gõ lại thì xóa lỗi
      input.addEventListener("input", function () {
        showSuccess(this);
        checkButtonState(); // Check xem nút được sáng lên chưa
      });
    });

    // 2. Validate riêng cho Email
    email.addEventListener("blur", function () {
      if (this.value !== "" && !isEmail(this.value)) {
        showError(this, "Email không hợp lệ");
      }
    });

    // 3. Validate riêng cho Phone
    phone.addEventListener("blur", function () {
      if (this.value !== "" && !isPhone(this.value)) {
        showError(this, "Số điện thoại không hợp lệ");
      }
    });

    // 4. Validate Password (độ dài)
    password.addEventListener("blur", function () {
      if (this.value !== "" && this.value.length < 6) {
        showError(this, "Mật khẩu phải từ 6 ký tự trở lên");
      }
    });

    // 5. Validate Confirm Password (phải trùng khớp)
    confirmPassword.addEventListener("blur", function () {
      if (this.value !== "" && this.value !== password.value) {
        showError(this, "Mật khẩu nhập lại không khớp");
      }
    });

    // 6. Hàm check xem có cho nút Sáng lên không
    const checkButtonState = () => {
      // Logic: Nút chỉ sáng khi tất cả ô đã điền VÀ không có class error nào
      const allFilled = inputs.every((input) => input.value.trim() !== "");
      const hasError =
        registerForm.querySelectorAll(".input-group.error").length > 0;

      if (allFilled && !hasError) {
        btnSubmit.classList.add("valid");
      } else {
        btnSubmit.classList.remove("valid");
      }
    };

    // 7. Chặn Submit nếu vẫn còn lỗi (Phòng trường hợp user cố tình Enter)
    registerForm.addEventListener("submit", (e) => {
      // Check lại tất cả lần cuối
      const isFilled = checkRequired(inputs);
      const hasError =
        registerForm.querySelectorAll(".input-group.error").length > 0;

      if (!isFilled || hasError) {
        e.preventDefault(); // Chặn gửi form
      }
    });
  }
});
