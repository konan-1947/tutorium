const User = require("../../models/User");

const findOrCreateUser = async (req, profile) => {
  try {
    let user = await User.findOne({ where: { email: profile.emails[0].value } });

    if (!user) {
      user = await User.create({
        username: profile.id,
        displayname: profile.displayName,
        password: "", 
        email: profile.emails[0].value,
        imgurl: profile.photos[0].value,
        dateofbirth: "2000-01-01", 
        address: "",
      });
    }
    // Lưu thông tin user vào session
    req.session.user = { userid: user.userid, email: user.email, imgurl:user.imgurl};
  
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = findOrCreateUser;
