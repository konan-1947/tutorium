//associations.js
const User = require('../models/User');
const WorkingTime = require('../models/WorkingTime');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const Permission = require('../models/Permission');
const PermissionRole = require('../models/PermissionRole');
const Tutor = require('../models/Tutor');
const Learner = require('../models/Learner');
const Accomplishment = require('../models/Accomplishment');
const Category = require('../models/Category');
const TutorCategory = require('../models/TutorCategory');
const LearnerCategory = require('../models/LearnerCategory');
const TutorTeachLearner = require('../models/TutorTeachLearner');
const Contract = require('../models/Contract');



const defineAssociations = () => {
  //User - WorkingTime (1-N)
  User.hasMany(WorkingTime, { foreignKey: 'userid' });
  WorkingTime.belongsTo(User, { foreignKey: 'userid' });

  //User - Role (N-N)
  User.belongsToMany(Role, { through: UserRole, foreignKey: 'userid', otherKey: 'roleid' });
  Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleid', otherKey: 'userid' });

  //Role - Permission (N-N)
  Role.belongsToMany(Permission, { through: PermissionRole, foreignKey: 'roleid', otherKey: 'permissionid' });
  Permission.belongsToMany(Role, { through: PermissionRole, foreignKey: 'permissionid', otherKey: 'roleid' });

  //User - Tutor (1-1)
  User.hasOne(Tutor, { foreignKey: 'userid' });
  Tutor.belongsTo(User, { foreignKey: 'userid' });

  //User - Learner (1-1)
  User.hasOne(Learner, { foreignKey: 'userid' });
  Learner.belongsTo(User, { foreignKey: 'userid' });

  //Tutor - Accomplishment (1-N)
  Tutor.hasMany(Accomplishment, { foreignKey: 'userid' });
  Accomplishment.belongsTo(Tutor, { foreignKey: 'userid' });

  //Tutor - Category (N-N)
  Tutor.belongsToMany(Category, { through: TutorCategory, foreignKey: 'userid', otherKey: 'categoryid' });
  Category.belongsToMany(Tutor, { through: TutorCategory, foreignKey: 'categoryid', otherKey: 'userid' });

  //Learner - Category (N-N)
  Learner.belongsToMany(Category, { through: LearnerCategory, foreignKey: 'userid', otherKey: 'categoryid' });
  Category.belongsToMany(Learner, { through: LearnerCategory, foreignKey: 'categoryid', otherKey: 'userid' });

  //Tutor - Learner thông qua TutorTeachLearner (N-N)
  Tutor.belongsToMany(Learner, { through: TutorTeachLearner, foreignKey: 'tutorid', otherKey: 'learnerid' });
  Learner.belongsToMany(Tutor, { through: TutorTeachLearner, foreignKey: 'learnerid', otherKey: 'tutorid' });

  //TutorTeachLearner - Contract (1-N)
  TutorTeachLearner.hasMany(Contract, { foreignKey: 'tutorteachlearnerid' });
  Contract.belongsTo(TutorTeachLearner, { foreignKey: 'tutorteachlearnerid' });
};
//sửa lại mối quan hệ n-n

module.exports = defineAssociations;


// Quan hệ	Loại quan hệ	Vị trí khóa ngoại
// A.hasOne(B)	One - To - One(1 - 1)	Trong B(target model)
// A.belongsTo(B)	One - To - One(1 - 1)	Trong A(source model)
// A.hasMany(B)	One - To - Many(1 - N)	Trong B(target model)
// A.belongsToMany(B, { through: 'C' })	Many - To - Many(N - N)	Bảng trung gian C
