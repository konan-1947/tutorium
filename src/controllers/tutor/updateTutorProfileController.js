const updateTutorService = require('../../services/tutor/updateTutorProfileService');

exports.updateTutorProfile = async (req, res) => {
    try {
        //const username = req.session.user.username;
       const username = "hiep";
        if (!username) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { displayname, imgurl, dateofbirth, address, description, descriptionvideolink } = req.body;

        const updatedTutor = await updateTutorService.updateTutor({
            username,
            displayname,
            imgurl,
            dateofbirth,
            address,
            description,
            descriptionvideolink
        });

        if (!updatedTutor) {
            return res.status(404).json({ message: "Tutor not found or update failed" });
        }

        return res.status(200).json({ message: "Tutor profile updated successfully", tutor: updatedTutor });
    } catch (error) {
        
        return res.status(400).json({ message: error.message });
    }
};