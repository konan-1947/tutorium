const User = require('../models/User'); 
const WorkingTime = require('../models/WorkingTime'); 
const defineAssociations = require('../models/associations');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log(users)
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        console.log("err")
    }
};

//getAllUsers();

const getAllWorkingTime = async (req, res) => {
    try {
        const workingTime = await WorkingTime.findAll();
        console.log(workingTime)
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        console.log("err")
    }
};

//getAllWorkingTime();

defineAssociations();

// Lấy các WorkingTime của User có userid = 1
User.findOne({
  where: { userid: 2 },
  include: [{
    model: WorkingTime,
    required: true  // Chỉ lấy những user có workingtime
  }]
}).then(user => {
  if (user) {
    console.log(user.WorkingTimes);  // In ra các workingtime của user
  } else {
    console.log('User not found');
  }
}).catch(err => {
  console.error('Error fetching data:', err);
});
