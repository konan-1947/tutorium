const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Tutor = require('./tutors');
const TutorTeachLearnerInContract = require('./tutor_teach_learner_in_contracts');

class TeachingSchedule extends Model {}

TeachingSchedule.init(
  {
    teaching_schedule_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tutor_teach_learner_in_contract_id: {
      type: DataTypes.INTEGER,
    },
    teaching_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    teaching_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tutor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
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
    modelName: 'TeachingSchedule',
    tableName: 'teaching_schedules',
    timestamps: false,
  }
);

TeachingSchedule.belongsTo(Tutor, { foreignKey: 'tutor_id' });
TeachingSchedule.belongsTo(TutorTeachLearnerInContract, { foreignKey: 'tutor_teach_learner_in_contract_id' });

module.exports = TeachingSchedule;
