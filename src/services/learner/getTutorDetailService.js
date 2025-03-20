const User = require("../../models/User");
const Tutor = require("../../models/Tutor");
const Category = require("../../models/Category");
const TutorCategory = require("../../models/TutorCategory");

exports.getTutorDetail = async (username) => {
    try {
        const tutor = await Tutor.findOne({
            include: [
                {
                    model: User,
                    where: { username }, // Tìm User dựa trên username
                    attributes: ['displayname', 'email', 'imgurl', 'address', 'dateofbirth']
                },
                {
                    model: Category,
                    through: { model: TutorCategory },
                    attributes: ['categoryname']
                },
            ],
            attributes: { exclude: ['verifytoken', 'verified_at', 'tokenexpiry'] }
        });

        if (!tutor) {
            throw new Error('Tutor not found');
        }

        return tutor;
    } catch (error) {
        console.error('Error fetching tutor details:', error);
        throw new Error(error.message || 'Internal server error');
    }
};