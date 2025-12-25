$(document).ready(function () {
  // 1. Khởi tạo Select2
  $("#province, #district, #ward").select2({
    width: "100%",
    placeholder: "Chọn địa điểm", // Thêm placeholder cho đẹp
    allowClear: true, // Cho phép xóa lựa chọn
  });

  const host = "https://provinces.open-api.vn/api/";

  // Hàm render dữ liệu ra thẻ select
  // Lưu ý: Mình giữ value là code để logic gọi API hoạt động
  const renderData = (array, selectId, label) => {
    let options = `<option value="">Chọn ${label}</option>`;
    array.forEach((item) => {
      // Lưu ý: data-name để lát nữa lấy tên gửi về server
      options += `<option value="${item.code}" data-name="${item.name}">${item.name}</option>`;
    });

    $(`#${selectId}`).html(options);

    // Quan trọng: Sau khi gán html mới, cần báo cho Select2 biết để cập nhật giao diện
    // $(`#${selectId}`).trigger('change.select2'); // (Tùy chọn, đôi khi không cần nếu chỉ thay nội dung)
  };

  // 2. Gọi API lấy danh sách Tỉnh/Thành phố khi vào trang
  fetch(host + "?depth=1")
    .then((res) => res.json())
    .then((data) => {
      renderData(data, "province", "Tỉnh/Thành phố");
    });

  // 3. Sự kiện: Khi chọn Tỉnh -> Load Quận/Huyện
  $("#province").on("change", function () {
    // Khi dùng Select2, $(this).val() vẫn lấy value chuẩn
    const pCode = $(this).val();

    if (pCode) {
      fetch(`${host}p/${pCode}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          // data.districts là mảng các quận trong tỉnh đó
          renderData(data.districts, "district", "Quận/Huyện");

          // Reset lại phường xã về trạng thái trống
          $("#ward").html('<option value="">Chọn Phường/Xã</option>');
        });
    } else {
      // Nếu bỏ chọn tỉnh thì xóa hết quận/phường
      $("#district").html('<option value="">Chọn Quận/Huyện</option>');
      $("#ward").html('<option value="">Chọn Phường/Xã</option>');
    }
  });

  // 4. [PHẦN BẠN THIẾU] Sự kiện: Khi chọn Quận/Huyện -> Load Phường/Xã
  $("#district").on("change", function () {
    const dCode = $(this).val();

    if (dCode) {
      fetch(`${host}d/${dCode}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          // data.wards là mảng các xã trong huyện đó
          renderData(data.wards, "ward", "Phường/Xã");
        });
    } else {
      $("#ward").html('<option value="">Chọn Phường/Xã</option>');
    }
  });

  // 5. [QUAN TRỌNG] Xử lý trước khi Submit form
  // API này trả về "Mã số" (1, 2, 3...) nhưng Database đơn hàng của bạn cần lưu "Tên" (Hà Nội, Ba Đình...)
  // Bạn cần thêm đoạn này để khi user chọn xong, nó tự động điền tên vào các ô input ẩn hoặc thay đổi value

  // Cách đơn giản nhất:
  // Lúc người dùng chọn xong, ta sẽ lấy text của option đó gán vào 1 thẻ input hidden
  // Nhưng để không sửa nhiều HTML, ta có thể dùng mẹo sau ở Controller (Server):
  // Hoặc tốt nhất là sửa luôn value của option ngay lúc chọn? KHÔNG ĐƯỢC, vì cần Code để gọi API cấp tiếp theo.
});


// Cập nhật tên Tỉnh vào input ẩn khi chọn
$('#province').on('select2:select', function (e) {
	var data = e.params.data;
	// Lấy text hiển thị (Ví dụ: Thành phố Hà Nội) gán vào input hidden
	$('#provinceName').val(data.text);
});

$('#district').on('select2:select', function (e) {
	var data = e.params.data;
	$('#districtName').val(data.text);
});

$('#ward').on('select2:select', function (e) {
	var data = e.params.data;
	$('#wardName').val(data.text);
});