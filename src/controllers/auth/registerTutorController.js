const registerTutorService = require("../../services/tutor/registerTutorService");

exports.registerTutor = async (req, res) => {
    try {
        const tutorData = req.body;
        const result = await registerTutorService.registerTutor(tutorData);
        try {
            const user = result.user;
            console.log("uiauiauia" + JSON.stringify(user));
            req.session.user = {
                userid: user.userid,
                email: user.email,
                username: user.username,
                displayname: user.displayname,
                imgurl: user.imgurl
            };
        } catch (error) {
            console.log(error);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
