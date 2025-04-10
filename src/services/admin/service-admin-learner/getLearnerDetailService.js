const Learner = require("../../../models/Learner");
const User = require("../../../models/User");
const Tutor = require("../../../models/Tutor");
const Category = require("../../../models/Category");


//hàm detail tung tutor
exports.getLearnerDetail = async (userid) => {
    try {
        const learner = await Learner.findOne({
            where: { userid },
            include: [
                {
                    model: User,
                    attributes: ['displayname', 'email', 'imgurl', 'address', 'dateofbirth' ,'imgurl'] // Lấy thông tin user
                },
                {
                    model: Category,
                    attributes: ['categoryid', 'categoryname'],
                    through: { attributes: [] } 
                }
                ,
                {
                    model: Tutor, // Lấy danh sách tutor mà learner đang theo dõi (quan hệ N-N qua LearnerFollowTutor)
                    attributes: ['userid'],
                    through: { attributes: [] }, // Không lấy bảng trung gian LearnerFollowTutor
                    include: [
                        { model: User, attributes: ['displayname'] }
                    ]
                }
            ]
        });

        if (!learner) {
            return { success: false, message: 'learner not found' };
        }

        return { success: true, data: learner };
    } catch (error) {
        console.error('Error fetching learner details:', error);
        return { success: false, message: 'Internal server error' };
    }
};