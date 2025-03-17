const Learner = require("../../../models/Learner");
const User = require("../../../models/User");
const Role = require("../../../models/Role");




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