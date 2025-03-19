const changeVerifiedAtService = require('../../services/learner/changeVerifiedAtService');

exports.changeVerifiedAt = async (req, res) => {
  try {
      const  userid  = req.session.userid || 24;
  
      const result = await changeVerifiedAtService.changeVerifiedAt(userid);
      res.status(200).json({ success: true, message: 'Learner changeVerified time successfully', data: result });
    } catch (error) {
      console.error('Error verifying learner:', error);
      res.status(400).json({ success: false, message: error.message });
    }

};