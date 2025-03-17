const verifyLearnerService = require('../../services/learner/verifyLearnerService');

exports.verifyLearner = async (req, res) => {
  try {
    const { userid } = req.params;
    const { learninggoal, categoryid, dateofbirth, address } = req.body;

    const result = await verifyLearnerService.verifyLearner(userid, learninggoal, categoryid, dateofbirth, address);
    res.status(200).json({ success: true, message: 'Learner verified successfully', data: result });
  } catch (error) {
    console.error('Error verifying learner:', error);
    res.status(400).json({ success: false, message: error.message });
  }

};