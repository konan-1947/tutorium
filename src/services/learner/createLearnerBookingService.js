const sequelize = require("../../config/db");
const { isBookingConflict } = require("../../utils/checkWorkingTimeUtils");

exports.bookTutor = async ({ username, starttime, endtime, target, payment, learnerId }) => {
    // Lấy tutorId từ username
    const tutor = await sequelize.query(
        `SELECT userid FROM Users WHERE username = :username`,
        { replacements: { username }, type: sequelize.QueryTypes.SELECT }
    );

    if (!tutor.length) {
        throw new Error("Không tìm thấy gia sư");
    }

    const tutorId = tutor[0].userid;
    console.log('tutorID', tutorId);

    // Kiểm tra xem có bị trùng lịch không
    const conflict = await isBookingConflict({ userId: tutorId, newStartTime: starttime, newEndTime: endtime });
    if (conflict) {
        throw new Error("Gia sư không rảnh vào thời gian này.");
    }

    // Lấy hoặc tạo tutorteachlearnerid từ bảng TutorsTeachLearners
    let tutorTeachLearner = await sequelize.query(
        `SELECT tutorteachlearnerid FROM TutorsTeachLearners 
         WHERE tutorid = :tutorId AND learnerid = :learnerId`,
        { replacements: { tutorId, learnerId }, type: sequelize.QueryTypes.SELECT }
    );

    let tutorTeachLearnerId;
    if (!tutorTeachLearner.length) {
        // Nếu chưa có mối quan hệ, tạo mới (không cần chỉ định tutorteachlearnerid vì nó tự tăng)
        await sequelize.query(
            `INSERT INTO TutorsTeachLearners (tutorid, learnerid)
             VALUES (:tutorId, :learnerId)`,
            { replacements: { tutorId, learnerId }, type: sequelize.QueryTypes.INSERT }
        );

        // Lấy tutorteachlearnerid vừa tạo
        tutorTeachLearner = await sequelize.query(
            `SELECT tutorteachlearnerid FROM TutorsTeachLearners 
             WHERE tutorid = :tutorId AND learnerid = :learnerId`,
            { replacements: { tutorId, learnerId }, type: sequelize.QueryTypes.SELECT }
        );
    }

    tutorTeachLearnerId = tutorTeachLearner[0].tutorteachlearnerid;
    console.log('tutorTeachLearnerId', tutorTeachLearnerId);

    // Lưu vào bảng Contracts với trạng thái 'pending'
    await sequelize.query(
        `INSERT INTO Contracts (tutorteachlearnerid, target, timestart, timeend, payment, status)
         VALUES (:tutorTeachLearnerId, :target, :timestart, :timeend, :payment, 'pending')`,
        {
            replacements: {
                tutorTeachLearnerId,
                target: target || "Học tập cơ bản", 
                timestart: starttime,
                timeend: endtime,
                payment: payment || 0 
            },
            type: sequelize.QueryTypes.INSERT,
        }
    );

    return { message: "Yêu cầu đặt lịch học đã được gửi thành công." };
};