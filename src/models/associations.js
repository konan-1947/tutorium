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
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
// const Session = require('../models/Session');



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

  //Tutor - Learner thông qua TutorTeachLearner (N-N)
  Tutor.belongsToMany(Learner, { through: TutorTeachLearner, foreignKey: 'tutorid', otherKey: 'learnerid' });
  Learner.belongsToMany(Tutor, { through: TutorTeachLearner, foreignKey: 'learnerid', otherKey: 'tutorid' });

  //TutorTeachLearner - Contract (1-N)
  TutorTeachLearner.hasMany(Contract, { foreignKey: 'tutorteachlearnerid' });
  Contract.belongsTo(TutorTeachLearner, { foreignKey: 'tutorteachlearnerid' });

  //Tutor - Learner thông qua LearnerFollowTutor (N-N) 
  Tutor.belongsToMany(Learner, { through: LearnerFollowTutor, foreignKey: 'tutorid', otherKey: 'learnerid' });
  Learner.belongsToMany(Tutor, { through: LearnerFollowTutor, foreignKey: 'learnerid', otherKey: 'tutorid' });
    
 // 1. User - Post: Một người dùng có nhiều bài viết
User.hasMany(Post, { foreignKey: 'userid', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userid' });

// 2. Post - Comment: Một bài viết có nhiều bình luận
Post.hasMany(Comment, { foreignKey: 'postid', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postid' });

// 3. User - Comment: Một người dùng có thể viết nhiều bình luận
User.hasMany(Comment, { foreignKey: 'userid', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userid' });

// 4. Post - PostImage: Một bài viết có nhiều ảnh
Post.hasMany(PostImage, { foreignKey: 'postid', as: 'images', onDelete: 'CASCADE' });
PostImage.belongsTo(Post, { foreignKey: 'postid', as: 'images' });

};


module.exports = defineAssociations;

