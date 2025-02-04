const User = require('../models/User'); 
const WorkingTime = require('../models/WorkingTime'); 


const defineAssociations = () => {
  // Định nghĩa mối quan hệ giữa WorkingTime và User
  WorkingTime.belongsTo(User, { foreignKey: 'userid' }); // Mỗi WorkingTime thuộc về một User
  User.hasMany(WorkingTime, { foreignKey: 'userid' }); // Mỗi User có thể có nhiều WorkingTime
};


module.exports = defineAssociations;
