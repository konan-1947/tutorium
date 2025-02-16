
## 4. **Folder `models`**
- **Chức năng**:  
  Định nghĩa cấu trúc bảng trong cơ sở dữ liệu và các thao tác trực tiếp với database.
- **Thứ tự thực hiện**:  
  `controllers` → `services` → `models`.
- **Cách xây dựng các file**:  
  - `userModel.js`: Định nghĩa bảng người dùng.  
  - `postModel.js`: Định nghĩa bảng bài viết.  
  - Sử dụng ORM (Sequelize, Mongoose) hoặc query thuần.  
- **Data ra/vào**:  
  - **Input**: Thông tin cần lưu vào database.  
  - **Output**: Kết quả query (document, record...).

---