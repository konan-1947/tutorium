const passport = require("passport");
const Learner = require("../models/Learner");
const UserRole = require("../models/UserRole");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Kiểm tra dữ liệu từ Google Profile
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
          throw new Error("No email provided by Google profile");
        }

        const email = profile.emails[0].value;
        console.log("Google profile email:", email); 

        // Tìm user theo email
        let user = await User.findOne({ where: { email } });
        if (!user) {
          console.log("Creating new user for email:", email); 
          user = await User.create({
            username: profile.id,
            displayname: profile.displayName || "Unknown",
            password: "",
            email,
            imgurl: profile.photos && profile.photos[0]?.value || "",
            dateofbirth: new Date("2000-01-01"),
            address: "",
          });

          // Tạo Learner
          await Learner.create({
            userid: user.userid,
            learninggoal: "",
            verified_at: null,
          });

          // Tạo UserRole
          await UserRole.create({
            userid: user.userid,
            roleid: 1, 
          });
        }

        return done(null, user);
        
      } catch (err) {
        console.error("Error in Google Strategy:", err.message, err.stack); // Log chi tiết lỗi
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err.message, err.stack);
    done(err, null);
  }
});

module.exports = passport;