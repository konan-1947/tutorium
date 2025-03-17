// file: services/auth/registerService.js
const User = require("../../models/User");
const Learner = require("../../models/Learner"); 
const UserRole = require("../../models/UserRole"); 
const { hashPassword } = require("../../utils/hash");
const sendMail = require("../../utils/mailUtil"); 
const registerUser = async (userData) => {
  
  const { username, displayname, password, email } = userData;
  const hashedPassword = await hashPassword(password);
  var a;
  try {
    a = await User.create({
      username,
      displayname,
      password: hashedPassword,
      email,
      imgurl: "https://www.gravatar.com/avatar/",
      dateofbirth: new Date("2000-01-01"),
      address: ""
    });

     // Tạo Learner với userid từ user vừa tạo
     await Learner.create({
      userid: a.userid,  // Liên kết với User
      learninggoal: "",     // Để trống
      verified_at: null     // Để trống
    });

    await UserRole.create({
      userid: a.userid,
      roleid: 1
    })

    //  // Gửi email mời làm Learner
    //  const learnerLink = `https://yourfrontend.com/become-learner/${a.id}`;
    //  await sendMail(
    //    a.email,
    //    'Bạn muốn trở thành Learner?',
    //    `Chào ${a.displayname}, nhấn vào link để verify to Learner: ${learnerLink}`,
    //    `<p>Chào <b>${a.displayname}</b>,</p>
    //    <p>Bạn đã đăng ký tài khoản thành công! Bạn phải trở thành Learner?</p>
    //    <p>Nhấn vào <a href="${learnerLink}">đây</a> để hoàn tất quá trình đăng ký Learner.</p>`
    //  );

  } catch (error) {
    console.log(error)
  }

  return a;
};

module.exports = registerUser;
