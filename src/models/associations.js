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
const LearnerFollowTutor = require('../models/LearnerFollowTutor');
const Promotion = require('../models/Promotion');


const defineAssociations = () => {
  //Tutor - WorkingTime (1-N)
  Tutor.hasMany(WorkingTime, { foreignKey: 'userid' });
  WorkingTime.belongsTo(Tutor, { foreignKey: 'userid' });

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


  // Tutor - TutorTeachLearner (1-N)
  Tutor.hasMany(TutorTeachLearner, { foreignKey: 'tutorid' });
  TutorTeachLearner.belongsTo(Tutor, { foreignKey: 'tutorid' });

  // TutorTeachLearner - Learner (N-1)
  TutorTeachLearner.belongsTo(Learner, { foreignKey: 'learnerid' });
  Learner.hasMany(TutorTeachLearner, { foreignKey: 'learnerid' });


  //TutorTeachLearner - Contract (1-N)
  TutorTeachLearner.hasMany(Contract, { foreignKey: 'tutorteachlearnerid' });
  Contract.belongsTo(TutorTeachLearner, { foreignKey: 'tutorteachlearnerid' });

  //Tutor - Learner thông qua LearnerFollowTutor (N-N) 
  Tutor.belongsToMany(Learner, { through: LearnerFollowTutor, foreignKey: 'tutorid', otherKey: 'learnerid' });
  Learner.belongsToMany(Tutor, { through: LearnerFollowTutor, foreignKey: 'learnerid', otherKey: 'tutorid' });

  //Tutor - Promotion (1-N)
  Tutor.hasMany(Promotion, { foreignKey: 'tutorid' });
  Promotion.belongsTo(Tutor, { foreignKey: 'tutorid' });

  //Contract - Promotion (N-1)
  Contract.belongsTo(Promotion, { foreignKey: 'promotionid' });
  Promotion.hasMany(Contract, { foreignKey: 'promotionid' });

};


module.exports = defineAssociations;

