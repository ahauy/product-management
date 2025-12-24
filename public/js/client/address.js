$(document).ready(function() {
  // Chỉ kích hoạt Select2 sau khi đã cấu hình các option mặc định
  $('#province, #district, #ward').select2({
      width: '100%'
      // Không đặt placeholder ở đây nếu bạn muốn hiện chữ "Chọn Tỉnh/Thành" từ HTML
  });

  const host = "https://provinces.open-api.vn/api/";

  const renderData = (array, selectId, label) => {
      let options = `<option value="">Chọn ${label}</option>`;
      array.forEach(item => {
          options += `<option value="${item.code}">${item.name}</option>`;
      });
      $(`#${selectId}`).html(options);
  };

  // Gọi API lấy tỉnh
  fetch(host + "?depth=1")
      .then(res => res.json())
      .then(data => renderData(data, "province", "Tỉnh/Thành phố"));

  // Logic thay đổi Quận/Huyện khi chọn Tỉnh
  $('#province').on('change', function() {
      const pCode = $(this).val();
      if (pCode) {
          fetch(`${host}p/${pCode}?depth=2`)
              .then(res => res.json())
              .then(data => {
                  renderData(data.districts, "district", "Quận/Huyện");
                  $('#ward').html('<option value="">Chọn Phường/Xã</option>');
              });
      }
  });
  
  // Tương tự cho Phường/Xã...
});