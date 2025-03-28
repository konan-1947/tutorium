const User = require("../../../models/User");
const Tutor = require("../../../models/Tutor");
const TutorTeachLearner = require("../../../models/TutorTeachLearner");
const Contract = require("../../../models/Contract");

exports.updateTutor = async (userid, updateData) => {
    try {
        const {
            imgurl, displayname, dateofbirth, address,
            description, descriptionvideolink
        } = updateData;

        // Cập nhật bảng Users
        await User.update(
            { displayname, dateofbirth, address, imgurl },
            { where: { userid } }
        );

        // Cập nhật bảng Tutors
        await Tutor.update(
            { description, descriptionvideolink },
            { where: { userid } }
        );

        // Lấy thông tin mới cập nhật
        const updatedTutor = await Tutor.findOne({
            where: { userid },
            attributes: { exclude: ['verifytoken', 'verified_at', 'tokenexpiry'] }, // Loại bỏ các trường không mong muốn
            include: [
                { model: User, attributes: ['username', 'displayname', 'email', 'dateofbirth', 'address', 'imgurl'] },
                {
                    model: TutorTeachLearner,
                    include: [
                        { model: Contract, attributes: ['contractid', 'status'] }
                    ]
                }
            ]
        });

        return updatedTutor;
    } catch (error) {
        throw new Error('Error updating tutor: ' + error.message);
    }
};