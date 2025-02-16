const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { hashPassword, comparePassword } = require('../../utils/auth/passwordUtil');
const { secret, expiresIn } = require('../../config/jwt');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email + " ")
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Tài khoản không tồn tại" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không đúng" });
        }
        
        const token = jwt.sign(
            { userid: user.userid, username: user.username },
            secret,
            { expiresIn }
        );

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server1", error });
    }
};



const register = async (req, res) => {
    try {
        const { username, displayname, password, email} = req.body;
        
        // Kiểm tra nếu username hoặc email đã tồn tại
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Tên tài khoản đã tồn tại" });
        }
        
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }
        
        // Hash mật khẩu
        const hashedPassword = await hashPassword(password);
        console.log("ok")
        // Tạo user mới
        const newUser = await User.create({
            username,
            displayname,
            password: hashedPassword,
            email,
            imgurl: "https://media.canva.com/v2/image-resize/format:PNG/height:181/quality:100/uri:s3%3A%2F%2Fmedia-private.canva.com%2FDrwtA%2FMAF6npDrwtA%2F1%2Fp.png/watermark:F/width:224?csig=AAAAAAAAAAAAAAAAAAAAAMSGnEjuZlPl06JAX8Tj3dP9wfu7RuQvHzwrKsQieiNY&exp=1739395629&osig=AAAAAAAAAAAAAAAAAAAAANyBjsVWO8eJYDMZwIbg1x2opWLU9oPEvZNxmh9KKdBp&signer=media-rpc&x-canva-quality=screen",
            dateofbirth: "0000-01-01"
        });

        return res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server1", error });
    }
};

module.exports = { login, register };
