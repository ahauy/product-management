# TenClothes Store 👕

**TenClothes Store** là một hệ thống phần mềm ứng dụng web thương mại điện tử chuyên biệt hỗ trợ quản lý và bán hàng trực tuyến dành cho các cửa hàng kinh doanh thời trang[cite: 7, 145, 146]. Hệ thống cung cấp trải nghiệm mua sắm liền mạch cho khách hàng, bộ công cụ vận hành đơn hàng nhanh chóng cho nhân viên và hệ thống quản trị, báo cáo chiến lược cho người quản lý[cite: 193, 253].

## 🚀 Công nghệ sử dụng

Dự án được xây dựng dựa trên kiến trúc **MVC (Model - View - Controller)**[cite: 231], tích hợp các công nghệ và dịch vụ hiện đại:

* **Frontend:** HTML, CSS, JavaScript[cite: 227].
* **UI Framework & Template Engine:** Bootstrap (Responsive Grid) và Pug[cite: 224, 228].
* **Backend:** Node.js với framework Express.js[cite: 231, 232].
* **Cơ sở dữ liệu:** Hệ quản trị CSDL NoSQL MongoDB kết hợp thư viện Mongoose (ODM)[cite: 239, 241].
* **Dịch vụ tích hợp (3rd Party):**
  * **Cloudinary:** Lưu trữ và quản lý hình ảnh sản phẩm/avatar trên cloud[cite: 406].
  * **Nodemailer:** Xử lý luồng gửi email tự động (xác nhận đơn hàng, khôi phục mật khẩu)[cite: 312, 401].
  * **TinyMCE:** Trình soạn thảo văn bản phong phú (Rich Text Editor) cho phần mô tả sản phẩm.

## ✨ Chức năng nổi bật

### 🛒 Dành cho Khách hàng
* **Tài khoản:** Đăng ký, đăng nhập, đổi mật khẩu, quên mật khẩu (nhận link qua email)[cite: 273].
* **Hồ sơ:** Cập nhật thông tin cá nhân, địa chỉ giao hàng và số điện thoại[cite: 273].
* **Mua sắm:** Tìm kiếm sản phẩm theo từ khóa, lọc theo danh mục, xem chi tiết (ảnh, size, mô tả)[cite: 273].
* **Giao dịch:** Thêm sản phẩm vào giỏ hàng, cập nhật số lượng, đặt hàng và thanh toán trực tuyến[cite: 273].
* **Theo dõi:** Xem lịch sử đơn hàng, trạng thái vận chuyển và đánh giá sản phẩm[cite: 273].

### 📦 Dành cho Nhân viên
* **Đơn hàng:** Quản lý và xử lý đơn hàng (duyệt, hủy, cập nhật trạng thái giao hàng)[cite: 273].
* **Kho hàng:** Tạo phiếu nhập hàng và tra cứu nhanh số lượng tồn kho theo thời gian thực[cite: 273].
* **Hỗ trợ:** Chat trực tiếp tư vấn và giải đáp thắc mắc cho khách hàng[cite: 273].

### 👑 Dành cho Quản trị viên (Admin)
* **Danh mục & Sản phẩm:** Tổ chức hiển thị, thêm/sửa/xóa thông tin hàng hóa, upload hình ảnh[cite: 273].
* **Khuyến mãi:** Tạo và quản lý mã giảm giá (Coupons)[cite: 273].
* **Báo cáo:** Thống kê doanh thu, hiệu quả kinh doanh thông qua biểu đồ trực quan[cite: 273].
* **Phân quyền:** Quản lý danh sách người dùng, cấp quyền chi tiết (Admin, Sales, Warehouse) hoặc khóa tài khoản vi phạm[cite: 273, 434].

---

## 🛠️ Hướng dẫn cài đặt & Triển khai dự án (Localhost)

### 1. Yêu cầu hệ thống tối thiểu
* **Node.js:** Phiên bản LTS (Khuyên dùng v18.x hoặc v20.x)[cite: 518].
* **MongoDB:** Cài đặt MongoDB Community Server đang chạy ở port mặc định (27017)[cite: 520].
* **Git**[cite: 522].

### 2. Tải mã nguồn về máy
Mở Terminal/Command Prompt và chạy các lệnh sau để clone dự án:
```bash
git clone [https://github.com/ahauy/product-management.git](https://github.com/ahauy/product-management.git)
cd product-management