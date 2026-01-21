let articleIntro = document.querySelector(".article__intro")
let articleContent = document.querySelector(".article__content")

if (articleIntro) {
  const htmlIntro = articleIntro.textContent
  articleIntro.innerHTML = htmlIntro
}

if (articleContent) {
  const htmlContent = articleContent.textContent
  articleContent.innerHTML = htmlContent
}

const menu = document.querySelector(".archive-post__col menu")
const btnMenu = document.querySelector(".archive-post__col menu .menu__header .menu__header--right i")

if (menu && btnMenu) {
  btnMenu.addEventListener("click", () => {
      // Toggle class 'close' cho menu cha
      menu.classList.toggle("close");
  });
}

// Hàm tạo Slug (biến tiêu đề thành id: "Tiêu đề bài viết" -> "tieu-de-bai-viet")
const slugify = (text) => {
  return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Thay khoảng trắng bằng dấu -
      .replace(/[^\w\-]+/g, '') // Xóa các ký tự đặc biệt
      .replace(/\-\-+/g, '-');  // Xóa dấu - trùng nhau
};

const renderTableOfContent = () => {
  let articleContent = document.querySelector(".article__content");
  const menuNav = document.querySelector(".menu__body nav");

  if (!articleContent || !menuNav) return;

  const headers = articleContent.querySelectorAll("h1, h2, h3, h4");
  if (headers.length === 0) return;

  // 1. Xác định cấp nhỏ nhất (Ví dụ bài viết bắt đầu bằng H2 thì minLevel = 2)
  const headerLevels = Array.from(headers).map(h => parseInt(h.tagName.substring(1)));
  const minLevel = Math.min(...headerLevels);

  // 2. Khởi tạo bộ đếm (Mảng chứa số đếm cho từng cấp: [0, 0, 0, 0, 0...])
  let counters = Array(10).fill(0); 

  const rootUl = document.createElement("ul");
  let stack = [{ level: minLevel, element: rootUl }];

  headers.forEach((header, index) => {
      // --- LOGIC TẠO ID & SCROLL ---
      let headerId = header.id || header.querySelector("span[id]")?.id;
      if (!headerId) {
          // Tạo ID nếu chưa có để link hoạt động
          headerId = `muc-luc-${index}`;
          header.id = headerId;
      }

      // --- LOGIC ĐÁNH SỐ (1., 1.1., 1.2...) ---
      const currentLevel = parseInt(header.tagName.substring(1));
      
      // Tăng số đếm ở cấp hiện tại
      counters[currentLevel]++;
      // Reset các cấp con sâu hơn về 0 (Ví dụ: đang 1.2 sang 2. thì reset cái đuôi .2 về 0)
      for (let i = currentLevel + 1; i < counters.length; i++) {
          counters[i] = 0;
      }

      // Tạo chuỗi số (Ví dụ: "1. ", "2.1. ")
      // Lấy các số từ minLevel đến currentLevel
      let numbering = "";
      for (let i = minLevel; i <= currentLevel; i++) {
          numbering += `${counters[i]}.`;
      }

      // --- TẠO HTML ---
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${headerId}`;
      
      // Gán nội dung: Số thứ tự + Tên tiêu đề
      a.textContent = `${numbering} ${header.textContent}`;

      // --- XỬ LÝ CLICK (Quan trọng: Không đóng menu) ---
      a.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.getElementById(headerId);
          if (target) {
              // Scroll mượt
              target.scrollIntoView({ behavior: "smooth", block: "start" });
              
              // LƯU Ý: Mình ĐÃ BỎ dòng code đóng menu ở đây
              // Menu sẽ giữ nguyên trạng thái mở
          }
      });

      li.appendChild(a);

      // --- LOGIC PHÂN CẤP MENU (Giữ nguyên như cũ) ---
      if (currentLevel > stack[stack.length - 1].level) {
          const newUl = document.createElement("ul");
          const lastLi = stack[stack.length - 1].element.lastElementChild;
          if (lastLi) {
              lastLi.appendChild(newUl);
              stack.push({ level: currentLevel, element: newUl });
          }
      } else {
          while (currentLevel < stack[stack.length - 1].level) {
              stack.pop();
          }
      }
      stack[stack.length - 1].element.appendChild(li);
  });

  menuNav.innerHTML = "";
  menuNav.appendChild(rootUl);
};

document.addEventListener("DOMContentLoaded", renderTableOfContent);