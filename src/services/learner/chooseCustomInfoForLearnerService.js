
// const Learners = require("../../models/Learner");
// const Users = require("../../models/User");
// const Categories = require("../../models/Category");
// const LearnersCategories = require("../../models/LearnerCategory");

// /**
//  * 
//  * @param {int} userid 
//  * @param {string} learninggoal 
//  * @param {string} categoryname 
//  * @param {string} description 
//  * @returns thoong tin learner va category cua learner moi duoc tao
//  */
// exports.verifyLearner = async (userid, learninggoal, categoryname, description) => {
//     // check user có tồn tại không
//     const user = await Users.findByPk(userid); 
//     if (!user) {
//         throw new Error('User not found');
//     }

//     // check xem category đã tồn tại chưa, nếu chưa thì tạo mới
//     let category = await Categories.findOne({ where: { categoryname } });
//     if (!category) {
//         category = await Categories.create({ categoryname, description });
//     }

//     // check user đã là Learner chưa
//     let learner = await Learners.findOne({ where: { userid } });
//     if (learner) {
//         throw new Error('User is already a learner');
//     }

//     // Create Learner
//     learner = await Learners.create({
//         userid,
//         learninggoal,
//         verify_at: new Date(),
//     });

//     // Create LearnersCategories thông qua Learner 
//     await LearnersCategories.create({
//         userid: learner.userid,
//         categoryid: category.categoryid
//     });

//     return { learner, category };
// };


const sequelize = require('../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize'); // Sửa lỗi import
const { getListCategories } = require("../../utils/getCategories");

exports.verifyLearner = async (userid, learninggoal, categoryid, dateofbirth, address) => {
    
    // Lấy danh sách category có sẵn từ utils
    const getCategories = await getListCategories();
    let selectedCategory = null;

    for (let i = 0; i < getCategories.length; i++) {
        if (getCategories[i].categoryid === categoryid) {
            selectedCategory = getCategories[i];
            break; 
        }
    }


    if (!selectedCategory) {
        throw new Error("Category không hợp lệ!");
    }

     // Lấy thời gian hiện tại ở định dạng ISO
     const verifiedAt = null;

    // Update thông tin Learner
    await sequelize.query(
        `UPDATE Learners 
     SET learninggoal = :learninggoal, verifiedat = NULL  
     WHERE userid = :userid`,
        {
            replacements: { userid, learninggoal },
            type: QueryTypes.UPDATE,
        }
    );

    // Update thông tin User
    await sequelize.query(
        `UPDATE Users 
     SET dateofbirth = :dateofbirth, address = :address 
     WHERE userid = :userid`,
        {
            replacements: { userid, dateofbirth, address },
            type: QueryTypes.UPDATE,
        }
    );
    // Liên kết Learner với Category
    await sequelize.query(
        "INSERT INTO LearnersCategories (userid, categoryid) VALUES (:userid, :categoryid)",
        {
            replacements: { userid, categoryid },
            type: QueryTypes.INSERT,
        }
    );

    return { learner: { userid, learninggoal, verifiedat: verifiedAt }, category: selectedCategory };

};