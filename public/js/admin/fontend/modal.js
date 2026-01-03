// 1. Lấy các phần tử modal
const modal = document.querySelector(".modal-overlay");
const btnClose = document.getElementById("btn-close-modal");
// Lấy tất cả nút
const btnShowStatisticals = document.querySelectorAll("[btn-show-statistical]");

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  // Format đẹp: 14:30 - 03/01/2026
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Hàm lấy chữ cái đầu tên để làm Avatar giả
function getInitials(name) {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

if (btnShowStatisticals.length > 0) {
  btnShowStatisticals.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dataProduct = btn.getAttribute("data-product");
      if (!dataProduct) return;
      const product = JSON.parse(dataProduct);

      // 1. Render Người Tạo (Style Card Xanh)
      let createHtml = `<td><span class="text-muted small">Chưa có thông tin</span></td>`;
      if (product.createdBy && product.createdBy.accountId) {
        const name = product.createdBy.fullName || "N/A";
        createHtml = `
									<td>
											<div class="user-card card-create">
													<div class="user-avatar-placeholder">
															<i class="fa-solid fa-plus"></i>
													</div>
													<div class="user-info">
															<span class="info-name">${name}</span>
															<span class="info-role">${product.createdBy.role || "Nhân viên"}</span>
															<span class="info-time">
																	<i class="fa-regular fa-clock"></i> 
																	${formatDate(product.createdBy.createdAt)}
															</span>
													</div>
											</div>
									</td>`;
      }

      // 2. Render Người Cập Nhật (Style Timeline Dọc)
      let updateHtml = `<td><span class="text-muted small">Chưa có cập nhật nào</span></td>`;
      if (product.updatedBy && product.updatedBy.length > 0) {
        // Đảo ngược để mới nhất lên đầu
        const updates = product.updatedBy.slice().reverse();

        const list = updates
          .map(
            (item) => `
									<div class="timeline-item">
											<div class="timeline-dot"></div>
											<div class="user-info">
													<span class="info-name">${item.fullName || "N/A"}</span>
													<span class="info-role">${item.role || "Nhân viên"}</span>
													<span class="info-time">
															<i class="fa-solid fa-pen-to-square"></i>
															${formatDate(item.updatedAt)}
													</span>
											</div>
									</div>
							`
          )
          .join("");

          updateHtml = `
          <td>
              <div class="timeline-scroll-area">
                  <div class="history-timeline">
                      ${list}
                  </div>
              </div>
          </td>`;
      }

      // 3. Render Người Xóa (Style Card Đỏ)
      let deleteHtml = `<td><span class="text-success small"><i class="fa-solid fa-check"></i> Đang hoạt động</span></td>`;
      if (product.deletedBy && product.deletedBy.accountId) {
        const name = product.deletedBy.fullName || "N/A";
        deleteHtml = `
									<td>
											<div class="user-card card-delete">
													<div class="user-avatar-placeholder">
															<i class="fa-solid fa-trash"></i>
													</div>
													<div class="user-info">
															<span class="info-name">${name}</span>
															<span class="info-role">${product.deletedBy.role || "Quản trị viên"}</span>
															<span class="info-time">
																	<i class="fa-regular fa-clock"></i> 
																	${formatDate(product.deletedBy.deletedAt)}
															</span>
													</div>
											</div>
									</td>`;
      }

      // 4. Render vào bảng (Thêm class table-history)
      const tbody = document.querySelector(".modal-overlay tbody");
      const table = document.querySelector(".modal-overlay table");
      if (table) table.classList.add("table-history"); // Thêm class cho table

      if (tbody) {
        tbody.innerHTML = `
									<tr>
											${createHtml}
											${updateHtml}
											${deleteHtml}
									</tr>
							`;
      }
			modal.classList.add("show");
    });
  });
}

if (btnClose) {
	btnClose.addEventListener('click', () => {
		modal.classList.remove("show")
	})
}

// 4. Click ra ngoài vùng trắng cũng đóng Modal
if (modal) {
  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.classList.remove("show");
    }
  });
}

