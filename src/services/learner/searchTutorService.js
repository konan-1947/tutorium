const { Op } = require("sequelize");
const User = require("../../models/User");
const Tutor = require("../../models/Tutor");
const Category = require("../../models/Category");

const { haversine } = require('../../utils/distance');
const { getCoordinatesFromAddress } = require('./getCoordinatesFromAddress');

module.exports = async (query) => {
    const { displayname, category, socialcreditsortasc, expectedsalary, address, userAddress } = query;

    console.log("Query received:", query);

    try {
        let whereCondition = {};
        let orderCondition = [];

        // Filter by displayname
        if (displayname) {
            whereCondition["$User.displayname$"] = { [Op.like]: `%${displayname}%` };
            console.log("Filter by displayname:", whereCondition["$User.displayname$"]);
        }

        // Filter by expected salary range
        if (expectedsalary) {
            const salaryRange = expectedsalary.split("-").map(Number);
            console.log("Expected salary range:", salaryRange);
            if (salaryRange.length === 2) {
                whereCondition["expectedsalary"] = { [Op.between]: salaryRange };
            }
        }

        // Filter by address
        if (address) {
            whereCondition["$User.address$"] = { [Op.like]: `%${address}%` };
            console.log("Filter by address:", whereCondition["$User.address$"]);
        }

        // Sort by social credit
        if (socialcreditsortasc) {
            const direction = socialcreditsortasc === "true" ? "ASC" : "DESC";
            orderCondition.push(["socialcredit", direction]);
            console.log("Sort by social credit:", direction);
        }

        // Query tutors
        console.log("Executing Sequelize query with conditions:", {
            whereCondition,
            orderCondition,
            category
        });

        const tutors = await Tutor.findAll({
            attributes: { exclude: ['verifytoken', 'verified_at', 'tokenexpiry'] },
            include: [
                {
                    model: User,
                    attributes: ["username", "address", "displayname"],
                    required: true,
                },
                {
                    model: Category,
                    attributes: ["categoryname"],
                    through: { attributes: [] },
                    where: category ? { categoryname: { [Op.like]: `%${category}%` } } : undefined,
                },
            ],
            where: whereCondition,
            order: orderCondition,
        });

        console.log(`Found ${tutors.length} tutor(s)`);

        // If user address is provided, calculate distances
        if (userAddress) {
            console.log("User address provided:", userAddress);
            const userCoords = await getCoordinatesFromAddress(userAddress);
            console.log("User coordinates:", userCoords);

            if (!userCoords) {
                throw new Error("Unable to get coordinates for the user address.");
            }

            const tutorsWithDistance = await Promise.all(
                tutors.map(async (tutor) => {
                    if (!tutor.User.address) {
                        console.warn("Tutor has no address:", tutor.User.username);
                        return null;
                    }

                    const tutorCoords = await getCoordinatesFromAddress(tutor.User.address);
                    if (!tutorCoords) {
                        console.warn(`Could not get coordinates for tutor: ${tutor.User.displayname}`);
                        return null;
                    }

                    const distance = haversine(
                        userCoords.latitude, userCoords.longitude,
                        tutorCoords.latitude, tutorCoords.longitude
                    );

                    console.log(`Distance from ${userAddress} to ${tutor.User.address}: ${distance.toFixed(2)} km`);

                    return { ...tutor.get({ plain: true }), distance };
                })
            );

            const filteredSortedTutors = tutorsWithDistance
                .filter(tutor => tutor !== null)
                .sort((a, b) => a.distance - b.distance);

            console.log("Returning sorted tutors by distance");
            return filteredSortedTutors;
        }

        return tutors;

    } catch (error) {
        console.error("Error during tutor query process:", error);
    }
};
