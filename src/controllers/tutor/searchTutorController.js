const searchTutorService = require("../../services/tutor/searchTutorService");

module.exports = async (req, res) => {
  try {
    const tutors = await searchTutorService(req.query);
    
    res.status(200).json({ tutors });
  
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
