// services/tutorService.js
const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.selectCategories = async (tutorId, categoryIds) => {
  try {
    // Kiểm tra tutor có tồn tại không
    const tutorExists = await sequelize.query(
      'SELECT COUNT(*) as count FROM Tutors WHERE userid = :tutorId',
      {
        replacements: { tutorId },
        type: QueryTypes.SELECT,
      }
    );

    if (tutorExists[0].count === 0) {
      throw new Error('Tutor không tồn tại');
    }

    // Dùng vòng for để thêm từng category
    for (let i = 0; i < categoryIds.length; i++) {
      const categoryId = categoryIds[i];
      await sequelize.query(
        `INSERT INTO TutorsCategories (userid, categoryid) 
         VALUES (:tutorId, :categoryId) 
         ON DUPLICATE KEY UPDATE categoryid = categoryid`,
        {
          replacements: { tutorId, categoryId },
          type: QueryTypes.INSERT,
        }
      );
    }

    return 'Trả về thành công';
  } catch (error) {
    throw error;
  }
};
