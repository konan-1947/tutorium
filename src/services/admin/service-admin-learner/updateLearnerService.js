const Learner = require("../../../models/Learner");
const User = require("../../../models/User");


exports.updateLearner = async (userid, updateData) => {
    try {
        //Chứa các thông tin cần cập nhật
        const { displayname, dateofbirth, imgurl, address, learninggoal } = updateData;


        // Cập nhật bảng Users
        await User.update(
            {  displayname, dateofbirth, address, imgurl },
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
            include: [{ model: User, attributes: ['displayname','dateofbirth', 'address', 'imgurl'] }]

        });

        return { success: true, data: updatedLearner };
    } catch (error) {
        throw new Error('Error updating learner: ' + error.message);
    }
};