const sequelize = require('../../../config/db'); // Import Sequelize instance
const { QueryTypes } = require('sequelize');

exports.getUnverifiedTutors = async () => {
    try {
        const query = `
            Select 
                t.userid,
                u.username,
                u.displayname,
                u.email,
                u.dateofbirth,
                u.address,
                t.description,
                t.descriptionvideolink,
                t.verifiedat
            from Tutors t
             join Users u ON t.userid = u.userid
             join UsersRoles ur ON u.userid = ur.userid
             join Roles r ON ur.roleid = r.roleid
            where t.verifiedat IS NULL
            AND r.rolename = 'tutor';
        `;

        const unverifiedTutors = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });

        return unverifiedTutors;
    } catch (error) {
        throw new Error('Unknow List tutor verifiedat IS NULL: ' + error.message);
    }
};

