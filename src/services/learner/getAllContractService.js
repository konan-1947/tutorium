const Learner = require("../../models/Learner");
const User = require("../../models/User");
const Contract = require("../../models/Contract");
const TutorTeachLearner = require("../../models/TutorTeachLearner");
const sequelize = require('../../config/db');

exports.getAllContract = async (userid) => {
    try {
        //ktra xem có người dùng này không
        const user = await User.findOne({ userid: userid });
        if (!user) {
            return { success: false, message: "User not found" };
        }
        //ktra xem  có phải là learner không
        const learner = await Learner.findOne({ userid: userid });
        if (!learner) {
            return { success: false, message: "User is not a learner" };
        }

        // Lấy ra tất cả các tutorteachlearnerid mà learner đã tạo
        const tutorTeachLearnerRecords = await TutorTeachLearner.findAll({
            where: { learnerid: userid }
        });

        // Trích xuất danh sách tutorteachlearnerid từ các bản ghi
        const tutorTeachLearnerIds = tutorTeachLearnerRecords.map(record => record.tutorteachlearnerid);

        // Lấy ra tất cả các contract có tutorteachlearnerid nằm trong mảng tutorTeachLearnerIds bằng raw query
        let contracts = [];
        if (tutorTeachLearnerIds.length > 0) {
            // Tạo chuỗi danh sách ID cho truy vấn SQL (ví dụ: "12, 15")
            const idsString = tutorTeachLearnerIds.join(', ');

            // Thực hiện raw query với JOIN để lấy thêm tên tutor và thời gian contract
            contracts = await sequelize.query(
                `
        SELECT 
            c.contractid, 
            c.tutorteachlearnerid, 
            c.target, 
            c.timestart, 
            c.timeend, 
            c.payment, 
            c.status, 
            c.promotionid, 
            u.displayname AS tutor_name
        FROM Contracts c
        JOIN TutorsTeachLearners ttl ON c.tutorteachlearnerid = ttl.tutorteachlearnerid
        JOIN Tutors t ON ttl.tutorid = t.userid
        JOIN Users u ON t.userid = u.userid
        WHERE c.tutorteachlearnerid IN (${idsString})
        `,
                { type: sequelize.QueryTypes.SELECT }
            );
        }
        console.log("Contracts:", contracts);
        return { success: true, data: contracts };

    } catch (error) {
        console.error("Lỗi trong getAllContract:", error);
        return { success: false, message: error.message };
    }
};
