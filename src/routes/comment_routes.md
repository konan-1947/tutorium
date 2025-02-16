## 5. **Folder `routes`**
- **Chức năng**:  
  Xác định endpoint và ánh xạ đến các controller tương ứng.
- **Thứ tự thực hiện**:  
  **Request** → `routes` → `middlewares` → `controllers`.
- **Cách xây dựng các file**:  
  - `userRoutes.js`: Định nghĩa các route liên quan đến người dùng.  
  - `postRoutes.js`: Định nghĩa các route liên quan đến bài viết.  
  - Sử dụng `Express.Router` để nhóm route.  
- **Data ra/vào**:  
  - **Input**: Request từ client.  
  - **Output**: Chuyển request đến controller.

---