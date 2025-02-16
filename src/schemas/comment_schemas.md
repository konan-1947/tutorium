
## 6. **Folder `schemas`**
- **Chức năng**:  
  Xác định schema để validate dữ liệu đầu vào (body, query, params).
- **Thứ tự thực hiện**:  
  **Request** → `schemas` → `middlewares` → `controllers`.
- **Cách xây dựng các file**:  
  - `userSchema.js`: Validate thông tin người dùng.  
  - `postSchema.js`: Validate bài viết.  
  - Sử dụng thư viện như `Joi` hoặc `Yup`.  
- **Data ra/vào**:  
  - **Input**: Dữ liệu từ request (body, params, query).  
  - **Output**: Dữ liệu đã validate hoặc lỗi nếu không hợp lệ.

---