
const User = require("../../../models/User");
const Tutor = require("../../../models/Tutor");
const Category = require("../../../models/Category");

const TutorCategory = require("../../../models/TutorCategory");
const Learner = require("../../../models/Learner");
const TutorTeachLearner = require("../../../models/TutorTeachLearner");
const Contract = require("../../../models/Contract");


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
                {
                    model: TutorTeachLearner,
                    include: [
                        {
                            model: Learner,
                            include: {
                                model: User,
                                attributes: ['displayname'] // Lấy displayname của learner từ bảng User
                            }
                        },
                        {
                            model: Contract,
                            attributes: ['contractid', 'status'] // Lấy trạng thái hợp đồng
                        }
                    ]
                }
            ]
        });

        return tutor; // Trả về trực tiếp dữ liệu
    } catch (error) {
        console.error('Error fetching tutor details:', error);
        throw new Error('Internal server error'); // Ném lỗi để xử lý ở phía gọi hàm
    }
};

