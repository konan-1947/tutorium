const User = require("../../models/User");

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.session.userid, {
            attributes: ["userid", "username", "displayname", "email", "imgurl", "dateofbirth"]
        });

        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }
        console.log(user);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy thông tin hồ sơ" });
    }
};
