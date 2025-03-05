const Learner = require("../../models/Learner");
const User = require("../../models/User");
const Role = require("../../models/Role");
const Tutor = require("../../models/Tutor");
const Category = require("../../models/Category");



//Hàm lấy list tutor 
exports.getLearner = async () => {
    return await Learner.findAll({
        include: [
            {
                model: User,
                attributes: ['userid', 'username', 'displayname', 'email', 'dateofbirth', 'address'],
                include: [
                    {
                        model: Role,
                        attributes: ['rolename'],
                        through: { attributes: [] }, // Loại bỏ bảng trung gian 
                    }
                ]
            }
        ]
    });
};

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

exports.updateLearner = async (userid, updateData) => {
    try {
        //Chứa các thông tin cần cập nhật
        const { username, displayname, email, dateofbirth, imgurl ,address, learninggoal } = updateData;

        // Cập nhật bảng Users
        await User.update(
            { username, displayname, email, dateofbirth, address, imgurl },
            { where: { userid } }
        );

        // Cập nhật bảng Learners
        await Learner.update(
            { learninggoal },
            { where: { userid } }
        );

        // Lấy thông tin mới cập nhật
        const updatedLearner = await Learner.findOne({
            where: { userid },
            include: [{ model: User, attributes: ['username', 'displayname', 'email', 'dateofbirth', 'address' , 'imgurl'] }]
            
        });

        return { success: true, data: updatedLearner };
    } catch (error) {
        throw new Error('Error updating learner: ' + error.message);
    }
};