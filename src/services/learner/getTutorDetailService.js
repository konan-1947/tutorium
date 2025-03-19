
const User = require("../../models/User");
const Tutor = require("../../models/Tutor");
const Category = require("../../models/Category");

const TutorCategory = require("../../models/TutorCategory");



exports.getTutorDetail = async (userid) => {
    try {
        const tutor = await Tutor.findOne({
            where: { userid },
            attributes: { exclude: ['verifytoken', 'verified_at', 'tokenexpiry'] }, // Loại bỏ các trường không mong muốn
            include: [
                {
                    model: User,
                    attributes: ['displayname', 'email', 'imgurl', 'address', 'dateofbirth'] // Lấy thông tin user
                },
                {
                    model: Category,
                    through: { model: TutorCategory },
                    attributes: ['categoryname'] // Lấy danh sách môn dạy
                },
            ]
        });

        return tutor; // Trả về trực tiếp dữ liệu
    } catch (error) {
        console.error('Error fetching tutor details:', error);
        throw new Error('Internal server error'); // Ném lỗi để xử lý ở phía gọi hàm
    }
};

