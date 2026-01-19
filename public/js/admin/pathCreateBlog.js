const formCreateBlog = document.querySelector("[form-create-blog]")

if(formCreateBlog) {
  const btnPublish = formCreateBlog.querySelector("[btn-publish]")
  const btnPending = formCreateBlog.querySelector("[btn-pending]")
  const btnDraft = formCreateBlog.querySelector("[btn-draft]")

  // Giữ nguyên biến gốc để tái sử dụng, không gán lại nó
  const dataPath = formCreateBlog.getAttribute("data-path")

  // ... (các sự kiện khác)

  if(btnDraft) {
    btnDraft.addEventListener("click", e => {
      e.preventDefault(); // 1. Chặn submit mặc định ngay lập tức
      
      const actionUrl = dataPath + "/draft"; // 2. Tạo biến mới thay vì gán đè vào const
      
      formCreateBlog.action = actionUrl; // 3. Cập nhật action
      formCreateBlog.submit(); // 4. Gửi form thủ công
    })
  }

  if(btnPending) {
    btnPending.addEventListener("click", e => {
      e.preventDefault(); // 1. Chặn submit mặc định ngay lập tức
      
      const actionUrl = dataPath + "/pending"; // 2. Tạo biến mới thay vì gán đè vào const
      
      formCreateBlog.action = actionUrl; // 3. Cập nhật action
      formCreateBlog.submit(); // 4. Gửi form thủ công
    })
  }

  if(btnPublish) {
    btnPublish.addEventListener("click", e => {
      e.preventDefault(); // 1. Chặn submit mặc định ngay lập tức
      
      const actionUrl = dataPath + "/publish"; // 2. Tạo biến mới thay vì gán đè vào const
      
      formCreateBlog.action = actionUrl; // 3. Cập nhật action
      formCreateBlog.submit(); // 4. Gửi form thủ công
    })
  }
}