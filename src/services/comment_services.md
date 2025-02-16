
## 7. **Folder `services`**
- **Chức năng**:  
  Xử lý logic nghiệp vụ, trung gian giữa `controllers` và `models`.
- **Thứ tự thực hiện**:  
  `controllers` → `services` → `models`.
- **Cách xây dựng các file**:  
  - `userService.js`: Xử lý logic liên quan đến người dùng.  
  - `postService.js`: Xử lý bài viết.  
  - Chỉ tập trung vào nghiệp vụ, không dính đến request/response.  
- **Data ra/vào**:  
  - **Input**: Dữ liệu từ controller (thường là dữ liệu đã validate).  
  - **Output**: Kết quả sau khi xử lý nghiệp vụ.

---