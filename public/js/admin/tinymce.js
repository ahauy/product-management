tinymce.init({
  selector: 'textarea#description, textarea#detail',  
  
  // Kích hoạt tính năng dính thanh công cụ
  toolbar_sticky: true, 

  // Tùy chọn: Nếu trang web của bạn có header cố định (như menu ở trên cùng),
  // bạn cần bù trừ khoảng cách đó để toolbar không bị che mất.
  // Ví dụ: Header cao 60px thì để offset là 60 hoặc 70.
  toolbar_sticky_offset: 0,
  plugins: 'image preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
  toolbar: 'image undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
  min_height: 500,        // Chiều cao tối thiểu ban đầu  
  autogrow_bottom_margin: 50, // Khoảng cách đệm bên dưới khi gõ xuống dòng cuối
  automatic_uploads: true,
  image_caption: true,
  // Xóa dòng images_upload_url đi vì chúng ta xử lý thủ công bên dưới
  // images_upload_url: '/admin/products/upload/tinymce', 
  
  images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', '/admin/upload/tinymce');

    xhr.upload.onprogress = (e) => {
      progress(e.loaded / e.total * 100);
    };

    xhr.onload = () => {
      // 403: Forbidden
      if (xhr.status === 403) {
        reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
        return;
      }

      // Các lỗi HTTP khác
      if (xhr.status < 200 || xhr.status >= 300) {
        reject('HTTP Error: ' + xhr.status);
        return;
      }

      const json = JSON.parse(xhr.responseText);

      // Kiểm tra xem server có trả về đúng format { location: "url..." } không
      if (!json || typeof json.location !== 'string') {
        reject('Invalid JSON: ' + xhr.responseText);
        return;
      }

      // Thành công -> Trả về đường dẫn ảnh
      resolve(json.location);
    };

    xhr.onerror = () => {
      reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    };

    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  })
});