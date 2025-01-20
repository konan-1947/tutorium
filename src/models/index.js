const Account = require('./accounts');
const Category = require('./categories');
const Learner = require('./learners');
const Tutor = require('./tutors');
const TutorTeachLearnerInContract = require('./tutor_teach_learner_in_contracts');
const TeachingSchedule = require('./teaching_schedules');
const LearnerInterestedInCategory = require('./learner_interested_in_categories');
const TutorSpecializedInCategory = require('./tutor_specialized_in_categories');

// Thiết lập quan hệ
Tutor.belongsToMany(Category, { through: TutorSpecializedInCategory });
Category.belongsToMany(Tutor, { through: TutorSpecializedInCategory });

Learner.belongsToMany(Category, { through: LearnerInterestedInCategory });
Category.belongsToMany(Learner, { through: LearnerInterestedInCategory });

module.exports = {
  Account,
  Category,
  Learner,
  Tutor,
  TutorTeachLearnerInContract,
  TeachingSchedule,
  LearnerInterestedInCategory,
  TutorSpecializedInCategory,
};
