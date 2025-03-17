
const User = require("../../../models/User");
const Tutor = require("../../../models/Tutor");
const TutorTeachLearner = require("../../../models/TutorTeachLearner");
const Contract = require("../../../models/Contract");



exports.updateTutor = async (userid, updateData) => {
    try {
        const {
            username, imgurl, displayname, email, dateofbirth, address,
            description, descriptionvideolink, expectedsalary, contracts
        } = updateData;

        // Cập nhật bảng Users
        await User.update(
            { username, displayname, email, dateofbirth, address, imgurl },
            { where: { userid } }
        );

        // Cập nhật bảng Tutors
        await Tutor.update(
            { description, descriptionvideolink, expectedsalary },
            { where: { userid } }
        );

        // Cập nhật trạng thái hợp đồng (Contracts) nếu cần
        if (contracts && Array.isArray(contracts)) {

            //lặp qua từng hợp đồng trong mảng contracts
            for (const contract of contracts) {
                await Contract.update(
                    { status: contract.status },

                    // Điều kiện: cập nhật bản ghi có contractid trùng với contractid được truyền vào
                    { where: { contractid: contract.contractid } }
                );
            }
        }

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
