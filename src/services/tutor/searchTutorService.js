//chứa các toán tử (operators) của Sequelize để dùng Like, BETWEEN ,....
const { Op } = require("sequelize");
const User = require("../../models/User");
const Tutor = require("../../models/Tutor");
const Category = require("../../models/Category");

const { haversine } = require('../../utils/distance');
const { getCoordinatesFromAddress } = require('./locationService');

module.exports = async (query) => {
    const { displayname, category, socialcreditsortasc, expectedsalary, address, userAddress } = query;
    try {

        let whereCondition = {};
        let orderCondition = []; //Mảng chứa các điều kiện sắp xếp dữ liệu (ORDER BY clause).

        //search theo displayname
        if (displayname) {
            whereCondition["$User.displayname$"] = { [Op.like]: `%${displayname}%` };
        }

        // Lọc theo khoảng lương mong muốn
        if (expectedsalary) {
            const salaryRange = expectedsalary.split("-").map(Number); // tách chuỗi thành mảng dựa theo(-) và chuyển lại dạng số
            if (salaryRange.length === 2) {
                whereCondition["expectedsalary"] = { [Op.between]: salaryRange };
            }
        }

        // Search theo địa chỉ (LIKE)
        if (address) {
            whereCondition["$User.address$"] = { [Op.like]: `%${address}%` };
        }

        // Sắp xếp theo socialcredit
        if (socialcreditsortasc) {
            orderCondition.push(["socialcredit", socialcreditsortasc === "true" ? "ASC" : "DESC"]);
        }


        // Truy vấn Tutor với điều kiện
        const tutors = await Tutor.findAll({
            attributes: { exclude: ['verifytoken', 'verified_at', 'tokenexpiry'] },
            include: [
                {
                    model: User,
                    attributes: ["username", "address","displayname"], // Lấy cả address
                    required: true, //Chỉ lấy các bản ghi có liên kết với bảng User
                },
                {
                    model: Category,
                    attributes: ["categoryname"],
                    through: { attributes: [] }, // Bỏ bảng trung gian
                    where: category ? { categoryname: { [Op.like]: `%${category}%` } } : undefined,
                },
            ],
            where: whereCondition,
            order: orderCondition,
        });

        // if (!userAddress) {
        //     return tutors;
        // }

        // // Lấy tọa độ (vĩ độ, kinh độ) của địa chỉ user = cách gọi hàm getCoordinatesFromAddress
        // const userCoords = await getCoordinatesFromAddress(userAddress);
        // if (!userCoords) {
        //     throw new Error("Không thể lấy tọa độ người dùng.");
        // }

        // // Lấy tất cả tọa độ của Tutors trước khi tính khoảng cách (giảm số lần gọi API)
        // const tutorsWithCoords = await Promise.all(
        //     // duyệt từng Tutor trong danh sách tutors
        //     tutors.map(async (tutor) => {

        //         if (!tutor.User.address) {
        //             //console.log(`Tutor ${tutor.User.username} không có địa chỉ.`);
        //             return null;
        //         }

        //         const tutorCoords = await getCoordinatesFromAddress(tutor.User.address);

        //         if (!tutorCoords) {
        //             //console.log(`Không tìm thấy tọa độ của địa chỉ: ${tutor.User.address}`);
        //             return null;
        //         }

        //         const distance = haversine(
        //             userCoords.latitude, userCoords.longitude,
        //             tutorCoords.latitude, tutorCoords.longitude
        //         );

        //         //console.log(`Khoảng cách từ ${userAddress} đến ${tutor.User.address}: ${distance} km`);

        //         //Trả về một đối tượng mới bao gồm thông tin của Tutor và khoảng cách (distance).
        //         return { ...tutor.get({ plain: true }), distance };
        //     })
        // );

        // // Lọc Tutor hợp lệ & sắp xếp theo khoảng cách
        // const sortedTutors = tutorsWithCoords
        //     .filter((tutor) => tutor !== null && tutor.distance !== null)
        //     .sort((a, b) => a.distance - b.distance);

        // return sortedTutors;

        if (userAddress) {
            // Lấy tọa độ (vĩ độ, kinh độ) của địa chỉ user = cách gọi hàm getCoordinatesFromAddress
            const userCoords = await getCoordinatesFromAddress(userAddress);
            if (!userCoords) {
                throw new Error("Không thể lấy tọa độ người dùng.");
            }

            // Lấy tất cả tọa độ của Tutors trước khi tính khoảng cách
            const tutorsWithDistance = await Promise.all(
                // duyệt từng Tutor trong danh sách tutors
                tutors.map(async (tutor) => {
                    if (!tutor.User.address) return null;

                    const tutorCoords = await getCoordinatesFromAddress(tutor.User.address);
                    if (!tutorCoords) return null;

                    const distance = haversine(
                        userCoords.latitude, userCoords.longitude,
                        tutorCoords.latitude, tutorCoords.longitude
                    );

                    ////Trả về một đối tượng mới bao gồm thông tin của Tutor và khoảng cách (distance).
                    return { ...tutor.get({ plain: true }), distance };
                })
            );

            // Sắp xếp theo khoảng cách
            return tutorsWithDistance
                //Loại bỏ các Tutor có giá trị null
                .filter(tutor => tutor !== null)
                .sort((a, b) => a.distance - b.distance); //Sắp xếp các Tutor theo khoảng cách tăng dần 
        }

        return tutors;

    } catch (error) {
        console.error("Lỗi trong quá trình truy vấn dữ liệu:", error);
    }

};

// async function testLocation() {
//     const address = "Thành Phố Hồ Chí Minh";
//     try {
//         const coords = await getCoordinatesFromAddress(address);
//         console.log("Tọa độ của người dùng:", coords);
//     } catch (error) {
//         console.error("Lỗi khi lấy tọa độ:", error.message);
//     }
// }

// testLocation();