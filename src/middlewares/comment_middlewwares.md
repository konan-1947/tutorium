## 3. **Folder `middlewares`**
- **Chức năng**:  
  Xử lý các tác vụ như xác thực, logging, hoặc xử lý lỗi trước khi request đến controller.
- **Thứ tự thực hiện**:  
  **Request** → `middlewares` → `controllers`.
- **Cách xây dựng các file**:  
  - `authMiddleware.js`: Kiểm tra token hoặc session.  
  - `errorHandler.js`: Xử lý và định dạng lỗi.  
- **Data ra/vào**:  
  - **Input**: Request từ client.  
  - **Output**: Request đã được sửa đổi (thêm thông tin như `userId`), hoặc gửi response lỗi nếu cần.

---