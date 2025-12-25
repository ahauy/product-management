$(document).ready(function () {
  const host = "https://provinces.open-api.vn/api/";

  // 1. Khởi tạo Select2
  $("#province, #district, #ward").select2({
    width: "100%",
    placeholder: "Chọn địa điểm",
    allowClear: true,
  });

  // Hàm hỗ trợ tìm Code từ Tên (Vì DB lưu Tên, API dùng Code)
  const findCodeByName = (dataList, name) => {
    if (!name) return null;
    // So sánh không phân biệt hoa thường cho chắc chắn
    const found = dataList.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    return found ? found.code : null;
  };

  // Hàm render dữ liệu
  const renderData = (array, selectId, label) => {
    let options = `<option value="">Chọn ${label}</option>`;
    array.forEach((item) => {
      options += `<option value="${item.code}" data-name="${item.name}">${item.name}</option>`;
    });
    $(`#${selectId}`).html(options);
  };

  // 2. Load Tỉnh/Thành phố (Chạy đầu tiên)
  fetch(host + "?depth=1")
    .then((res) => res.json())
    .then((data) => {
      renderData(data, "province", "Tỉnh/Thành phố");

      // --- LOGIC MỚI: TỰ ĐỘNG CHỌN LẠI GIÁ TRỊ CŨ ---
      const defaultProvince = $("#province").data("default");
      if (defaultProvince) {
        const code = findCodeByName(data, defaultProvince);
        if (code) {
          // Set giá trị và kích hoạt sự kiện change để load tiếp Quận/Huyện
          $("#province").val(code).trigger("change");
        }
      }
    });

  // 3. Sự kiện: Khi chọn Tỉnh -> Load Quận/Huyện
  $("#province").on("change", function () {
    const pCode = $(this).val();

    if (pCode) {
      fetch(`${host}p/${pCode}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          renderData(data.districts, "district", "Quận/Huyện");

          // --- LOGIC MỚI: TỰ ĐỘNG CHỌN QUẬN NẾU CÓ ---
          const defaultDistrict = $("#district").data("default");
          if (defaultDistrict) {
            const code = findCodeByName(data.districts, defaultDistrict);
            if (code) {
              $("#district").val(code).trigger("change");
            }
          }

          // Reset phường xã
          if (!defaultDistrict)
            $("#ward").html('<option value="">Chọn Phường/Xã</option>');
        });
    } else {
      $("#district").html('<option value="">Chọn Quận/Huyện</option>');
      $("#ward").html('<option value="">Chọn Phường/Xã</option>');
    }
  });

  // 4. Sự kiện: Khi chọn Quận/Huyện -> Load Phường/Xã
  $("#district").on("change", function () {
    const dCode = $(this).val();

    if (dCode) {
      fetch(`${host}d/${dCode}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          renderData(data.wards, "ward", "Phường/Xã");

          // --- LOGIC MỚI: TỰ ĐỘNG CHỌN XÃ NẾU CÓ ---
          const defaultWard = $("#ward").data("default");
          if (defaultWard) {
            const code = findCodeByName(data.wards, defaultWard);
            if (code) $("#ward").val(code).trigger("change"); // Trigger change nếu cần xử lý gì thêm
          }
        });
    } else {
      $("#ward").html('<option value="">Chọn Phường/Xã</option>');
    }
  });

  // 5. Cập nhật tên vào input ẩn (Để gửi về server)
  $("#province").on("select2:select", function (e) {
    $("#provinceName").val(e.params.data.text);
  });
  $("#district").on("select2:select", function (e) {
    $("#districtName").val(e.params.data.text);
  });
  $("#ward").on("select2:select", function (e) {
    $("#wardName").val(e.params.data.text);
  });
});
