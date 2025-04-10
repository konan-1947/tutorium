const User = require("../../../models/User");
const Tutor = require("../../../models/Tutor");
const Role = require("../../../models/Role");

//Hàm lấy list tutor 
exports.getTutors = async () => {
    return await Tutor.findAll({
        attributes: { exclude: ['verifytoken', 'verified_at', 'tokenexpiry'] }, // Loại bỏ các trường không mong muốn
        include: [
            {
                model: User,
                attributes: ['userid', 'username', 'displayname', 'email', 'dateofbirth', 'address'],
                include: [
                    {
                        model: Role,
                        attributes: ['rolename'],
                        through: { attributes: [] }, // Loại bỏ bảng trung gian UsersRoles khỏi response
                    }

                ]
            }
        ]
    });
};

