## 1. **Folder `config`**
- **Chức năng**:  
  Lưu các file cấu hình, bao gồm kết nối database, biến môi trường, và các cấu hình liên quan đến ứng dụng.
- **Thứ tự thực hiện**:  
  Được sử dụng khi ứng dụng khởi động (`app.js` import các file trong `config` để setup).
- **Cách xây dựng các file**:  
  - `db.js`: Kết nối cơ sở dữ liệu.  
  - `env.js`: Xử lý biến môi trường.  
- **Data ra/vào**:  
  - **Input**: Không có input trực tiếp từ người dùng, chỉ sử dụng thông tin cấu hình.  
  - **Output**: Cung cấp các kết nối hoặc giá trị cấu hình cho các phần khác của ứng dụng.

---
