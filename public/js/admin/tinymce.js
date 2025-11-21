tinymce.init({
  selector: 'textarea#description',
  plugins: 'lists link image table code help wordcount',
  automatic_uploads: true,
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