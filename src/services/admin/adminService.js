const User = require("../../models/User");
const Role = require("../../models/Role");
const UserRole = require("../../models/UserRole");
const { Op } = require('sequelize');

exports.getAdminList = async () => {
    try {
        const admins = await User.findAll({
            include: [
                {
                    model: Role,
                    through: { model: UserRole },
                    attributes: ['rolename'],
                    where: {
                        rolename: { [Op.in]: ['admincontent', 'adminsystem'] } //chưa 1 trong 2 cai 
                    }
                }
            ],
            attributes: ['userid', 'username', 'displayname', 'email', 'dateofbirth', 'address']
        });

        return admins;
    } catch (error) {
        throw new Error('Error fetching admin list: ' + error.message);
    }
};
