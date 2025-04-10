// services/tutorService.js
const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

exports.createCategory = async (tutorId, categoryname, description) => {

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

        // Kiểm tra xem categoryname đã tồn tại trong TutorsCategories của tutor chưa
        const tutorCategoryExists = await sequelize.query(
            `SELECT COUNT(*) as count 
       FROM TutorsCategories as tc 
       JOIN Categories as c ON tc.categoryid = c.categoryid 
       WHERE tc.userid = :tutorId AND c.categoryname = :categoryname`,
            {
                replacements: { tutorId, categoryname },
                type: QueryTypes.SELECT,
            }
        );

        if (tutorCategoryExists[0].count > 0) {
            throw new Error('Đã tồn tại category này trong danh sách dạy của bạn');
        }

        // Kiểm tra xem categoryname đã tồn tại trong bảng Categories chưa
        const categoryExists = await sequelize.query(
            'SELECT categoryid FROM Categories WHERE categoryname = :categoryname',
            {
                replacements: { categoryname },
                type: QueryTypes.SELECT,
            }
        );

        let categoryId;
        if (categoryExists.length > 0) {
            // Nếu category đã tồn tại trong Categories, lấy categoryid
            categoryId = categoryExists[0].categoryid;

            // Thêm vào TutorsCategories vì đã xác định chưa tồn tại ở trên
            await sequelize.query(
                'INSERT INTO TutorsCategories (userid, categoryid) VALUES (:tutorId, :categoryId)',
                {
                    replacements: { tutorId, categoryId },
                    type: QueryTypes.INSERT,
                }
            );
        } else {
            // Nếu category chưa tồn tại trong Categories, thêm mới
            const [result] = await sequelize.query(
                'INSERT INTO Categories (categoryname, description) VALUES (:categoryname, :description)',
                {
                    replacements: { categoryname, description },
                    type: QueryTypes.INSERT,
                }
            );
            categoryId = result; // categoryid được trả về từ INSERT

            // Thêm vào TutorsCategories
            await sequelize.query(
                'INSERT INTO TutorsCategories (userid, categoryid) VALUES (:tutorId, :categoryId)',
                {
                    replacements: { tutorId, categoryId },
                    type: QueryTypes.INSERT,
                }
            );
        }

        // Lấy thông tin category vừa liên kết hoặc tạo mới
        const [newCategory] = await sequelize.query(
            'SELECT categoryid, categoryname, description FROM Categories WHERE categoryid = :categoryId',
            {
                replacements: { categoryId },
                type: QueryTypes.SELECT,
            }
        );


        return newCategory;
    } catch (error) {
        throw error;
    }
};