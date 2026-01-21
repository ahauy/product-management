const formEditBlog = document.querySelector("[form-edit-blog]")

if(formEditBlog) {
  const btnPublish = formEditBlog.querySelector("[btn-publish]")
  const btnPending = formEditBlog.querySelector("[btn-pending]")
  const btnDraft = formEditBlog.querySelector("[btn-draft]")
  const btnConceal = formEditBlog.querySelector("[btn-conceal]")

  // Giữ nguyên biến gốc để tái sử dụng, không gán lại nó
  const dataPath = formEditBlog.getAttribute("data-path")

  // ... (các sự kiện khác)

  if(btnDraft) {
    btnDraft.addEventListener("click", e => {
      e.preventDefault(); // 1. Chặn submit mặc định ngay lập tức
      
      const actionUrl = dataPath + "/draft?_method=PATCH"; // 2. Tạo biến mới thay vì gán đè vào const
      
      formEditBlog.action = actionUrl; // 3. Cập nhật action
      formEditBlog.submit(); // 4. Gửi form thủ công
    })
  }

  if(btnPending) {
    btnPending.addEventListener("click", e => {
      e.preventDefault(); // 1. Chặn submit mặc định ngay lập tức
      
      const actionUrl = dataPath + "/pending?_method=PATCH"; // 2. Tạo biến mới thay vì gán đè vào const
      
      formEditBlog.action = actionUrl; // 3. Cập nhật action
      formEditBlog.submit(); // 4. Gửi form thủ công
    })
  }

  if(btnPublish) {
    btnPublish.addEventListener("click", e => {
      e.preventDefault(); // 1. Chặn submit mặc định ngay lập tức
      
      const actionUrl = dataPath + "/publish?_method=PATCH"; // 2. Tạo biến mới thay vì gán đè vào const
      
      formEditBlog.action = actionUrl; // 3. Cập nhật action
      formEditBlog.submit(); // 4. Gửi form thủ công
    })
  }

  if(btnConceal) {
    btnConceal.addEventListener("click", e => {
      e.preventDefault(); // 1. Chặn submit mặc định ngay lập tức
      
      const actionUrl = dataPath + "/conceal?_method=PATCH"; // 2. Tạo biến mới thay vì gán đè vào const
      
      formEditBlog.action = actionUrl; // 3. Cập nhật action
      formEditBlog.submit(); // 4. Gửi form thủ công
    })
  }
}