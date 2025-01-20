const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Tutor = require('./tutors');
const Learner = require('./learners');

class TutorTeachLearnerInContract extends Model {}

TutorTeachLearnerInContract.init(
  {
    tutor_teach_learner_in_contract_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tutor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    learner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment: {
      type: DataTypes.DECIMAL(10, 2),
    },
    course_name: {
      type: DataTypes.STRING,
    },
    note: {
      type: DataTypes.TEXT,
    },
    date_start: {
      type: DataTypes.DATE,
    },
    expected_date_end: {
      type: DataTypes.DATE,
    },
    real_date_end: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'TutorTeachLearnerInContract',
    tableName: 'tutor_teach_learner_in_contracts',
    timestamps: false,
  }
);

TutorTeachLearnerInContract.belongsTo(Tutor, { foreignKey: 'tutor_id' });
TutorTeachLearnerInContract.belongsTo(Learner, { foreignKey: 'learner_id' });

module.exports = TutorTeachLearnerInContract;
