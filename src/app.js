const express = require('express');
const db = require('./config/db'); // Đường dẫn tới file cấu hình Sequelize
const Account = require('./models/accounts'); // Import model 'Account'
const Learner = require('./models/learners'); // Import model 'Learner'
const Category = require('./models/categories'); // Import model 'Category'
const LearnerCategory = require('./models/learner_interested_in_categories'); // Import model 'learner_interested_in_categories'

const app = express();
const port = 3000;

// Cấu hình Express để hỗ trợ JSON
app.use(express.json());

// Định nghĩa API để lấy các email learner quan tâm đến category "Mathematics"
app.get('/learners/interested-in-mathematics', async (req, res) => {
  try {
    // Tìm tất cả learner có hứng thú với category "Mathematics"
    const learnersWithMathInterest = await LearnerCategory.findAll({
      include: [
        {
          model: Learner,
          include: {
            model: Account,
            attributes: ['email'], // Chỉ lấy thông tin email của learner
          },
        },
        {
          model: Category,
          where: { category_name: 'Mathematics' }, // Lọc theo category "Mathematics"
        },
      ],
    });

    // Trích xuất email từ kết quả truy vấn
    const emails = learnersWithMathInterest.map(item => item.Learner.Account.email);

    res.status(200).json(emails); // Trả về danh sách email
  } catch (error) {
    console.error('Lỗi khi lấy danh sách email learner:', error);
    res.status(500).json({ message: 'Lỗi server, không thể lấy danh sách email learner' });
  }
});

// Lắng nghe yêu cầu
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
