
## 2. **Folder `controllers`**
- **Chức năng**:  
  Xử lý logic liên quan đến request và response, giao tiếp với `services` để thực hiện nghiệp vụ.
- **Thứ tự thực hiện**:  
  **Request** → `middlewares` → `controllers` → `services`.
- **Cách xây dựng các file**:  
  - Tên file tương ứng với resource, ví dụ:  
    - `userController.js`: Xử lý các thao tác liên quan đến người dùng.  
    - `postController.js`: Xử lý bài viết.  
  - Mỗi file export các hàm tương ứng với HTTP method (`GET`, `POST`, `PUT`, `DELETE`).
- **Data ra/vào**:  
  - **Input**: Request từ client (parameters, body, headers).  
  - **Output**: Response về client (status code, data JSON).

---