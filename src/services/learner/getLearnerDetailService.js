const Learner = require("../../models/Learner");
const User = require("../../models/User");
const Category = require("../../models/Category");

exports.getLearnerDetail = async (userid) => {
    try {
        console.log("Gọi getLearnerDetail với userid:", userid);

        const learner = await Learner.findOne({
            where: { userid },
            include: [
                {
                    model: User,
                    attributes: ['displayname', 'email', 'imgurl', 'address', 'dateofbirth']
                },
                {
                    model: Category,
                    attributes: ['categoryid', 'categoryname'],
                    through: { attributes: [] } 
                }
            ]
        });

        console.log("Learner tìm thấy:", learner);

        if (!learner) {
            console.warn("Learner không tồn tại với userid:", userid);
            return { success: false, message: 'Learner not found' };
        }

        return learner;
    } catch (error) {
        console.error("Lỗi trong getLearnerDetailService:", error);
        return { success: false, message: error.message }; 
    }
};
