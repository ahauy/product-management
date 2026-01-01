document.addEventListener("DOMContentLoaded", () => {
  const miu = document.querySelector(".timer .miu");
  const sec = document.querySelector(".timer .sec");

  // Kiểm tra xem phần tử có tồn tại không để tránh lỗi
  if (miu && sec) {
    // Tổng thời gian đếm ngược (tính bằng giây)
    // Ví dụ: 3 phút = 3 * 60 = 180 giây
    let totalSeconds = 180; 

    const timerInterval = setInterval(() => {
      // 1. Tính toán số phút và giây còn lại
      const minutesLeft = Math.floor(totalSeconds / 60);
      const secondsLeft = totalSeconds % 60;

      // 2. Hiển thị ra màn hình (thêm số 0 đằng trước nếu nhỏ hơn 10)
      miu.innerHTML = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft;
      sec.innerHTML = secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;

      // 3. Kiểm tra hết giờ
      if (totalSeconds <= 0) {
        clearInterval(timerInterval); // Dừng đồng hồ
        // Bạn có thể thêm hành động khi hết giờ ở đây, ví dụ: alert("Hết giờ!");
        return;
      }

      // 4. Giảm tổng thời gian đi 1 giây
      totalSeconds--;

    }, 1000);
  }
});