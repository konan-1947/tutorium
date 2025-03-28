// const Learner = require("../../../models/Learner");
// const User = require("../../../models/User");
// const Role = require("../../../models/Role");

const sequelize = require("../../../config/db");




// //Hàm lấy list tutor 
// exports.getLearner = async () => {
//     return await Learner.findAll({
//         include: [
//             {
//                 model: User,
//                 attributes: ['userid', 'username', 'displayname', 'email', 'dateofbirth', 'address'],
//                 include: [
//                     {
//                         model: Role,
//                         attributes: ['rolename'],
//                         through: { attributes: [] }, // Loại bỏ bảng trung gian 
//                     }
//                 ]
//             }
//         ]
//     });
// };

//const sequelize = require('../../../config/db');
const { QueryTypes } = require('sequelize');

// //Hàm lấy list tutor 
exports.getLearner = async () => {
    const query1 = `Select u.userid, u.username, u.displayname, u.email, u.dateofbirth, u.address, r.rolename 
     from Learners AS l join Users as u on
    l.userid = u.userid
     join UsersRoles as ur on ur.userid = u.userid
     join Roles as r on r.roleid = ur.roleid`

    const learner = await sequelize.query(query1, {
        type: QueryTypes.SELECT
    })

    if (learner.length === 0) {
        throw new Error("List Learner not found");
    }

    return learner;
};