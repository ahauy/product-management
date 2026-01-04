document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(".restore-timer-wrapper");

  const updateTimers = () => {
    const now = new Date().getTime();
    // Chu vi vòng tròn (dùng path circle trong SVG viewBox 36) => Chu vi ~ 100
    const circumference = 100;

    wrappers.forEach((wrapper) => {
      // Lấy thời gian xóa từ attribute pug in ra
      const deletedAtStr = wrapper.getAttribute("data-time");
      const deletedAt = new Date(deletedAtStr).getTime();

      // 60 phút tính bằng mili giây
      const limitMinutes = parseInt(wrapper.getAttribute("data-limit") || 60);
      const limitMs = limitMinutes * 60 * 1000;

      // Tính thời gian đã trôi qua
      const timePassed = now - deletedAt;
      // Thời gian còn lại
      const timeLeft = limitMs - timePassed;

      const progressRing = wrapper.querySelector(".progress-ring");
      const btnRestore = wrapper.querySelector("button");

      if (timeLeft <= 0) {
        // --- HẾT GIỜ ---
        // Ẩn nút đi hoặc xóa khỏi DOM
        wrapper.style.opacity = "0.7";
        wrapper.style.pointerEvents = "none"
        wrapper.style.cursor = "default"
      } else {
        // --- CÒN GIỜ ---
        // Tính tỷ lệ % thời gian còn lại (từ 1 xuống 0)
        const ratio = timeLeft / limitMs;

        // Tính offset:
        // Full vòng = 100 (ratio = 1) -> offset = 0
        // Hết vòng = 0 (ratio = 0) -> offset = 100
        const offset = circumference - ratio * circumference;

        if (progressRing) {
          progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
          progressRing.style.strokeDashoffset = offset;

          // Đổi màu thành đỏ khi còn dưới 5 phút
          if (timeLeft < 5 * 60 * 1000) {
            progressRing.style.stroke = "#dc3545";
          }
        }
      }
    });
  };

  // Chạy ngay lập tức khi load trang
  updateTimers();
  // Cập nhật mỗi giây
  setInterval(updateTimers, 1000);
});
