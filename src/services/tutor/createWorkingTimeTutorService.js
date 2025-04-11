const sequelize = require('../../config/db'); // Import Sequelize instance
const { mergeWorkingTimes } = require('../../utils/mergeWorkingTimes');

exports.createWorkingTime = async ({ userId, newStartTime, newEndTime }) => {
    const now = new Date();
    const finalStartTime = new Date(newStartTime);
    const finalEndTime = new Date(newEndTime);

    // Kiểm tra thời gian hợp lệ
    if (finalStartTime < now) throw new Error("Không thể đặt lịch trong quá khứ.");
    if ((finalEndTime - now) / (1000 * 60 * 60 * 24) > 7) throw new Error("Không thể đặt lịch vượt quá phạm vi 1 tuần");
    if (finalStartTime >= finalEndTime) throw new Error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");

    try {


        // Kiểm tra số lượng hợp đồng chưa hoàn thành (loại trừ pending và cancelled)
        const contractResult = await sequelize.query(
            `SELECT COUNT(*) as count 
             FROM Contracts C
             JOIN TutorsTeachLearners TTL ON C.tutorteachlearnerid = TTL.tutorteachlearnerid
             WHERE TTL.tutorid = :userId 
             AND C.status NOT IN ('done', 'pending', 'cancelled')`,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        const contractCount = contractResult[0]; // Lấy phần tử đầu tiên
        if (contractCount.count > 1) {

            return {"error": "Tutor có quá nhiều hợp đồng đang thực hiện (> 2), không thể thêm lịch rảnh."};
        }


        // Gọi hàm merge từ utils
        const { finalStartTime, finalEndTime, merged } = await mergeWorkingTimes({ userId, newStartTime, newEndTime });

        // Thêm khoảng thời gian mới (đã gộp nếu cần)
        await sequelize.query(
            `INSERT INTO WorkingTimes (userid, starttime, endtime) 
             VALUES (:userid, :starttime, :endtime)`,
            {
                replacements: {
                    userid: userId,
                    starttime: finalStartTime,
                    endtime: finalEndTime,
                },
                type: sequelize.QueryTypes.INSERT
            }
        );

        return merged ? "merged" : "nomerged";
    } catch (error) {
        console.error("Error adding working time:", error);
        return error;
    }
};
