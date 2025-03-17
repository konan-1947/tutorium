const express = require("express");
const searchTutorController = require("../controllers/learner/searchTutorController");
const getLearnerDetail = require("../controllers/learner/getLearnerDetailController");
const verifyLearner  = require('../controllers/learner/verifyLearnerController');

const router = express.Router();

// Sử dụng các controller như một hàm callback
router.get("/findTutor", searchTutorController);
router.get("/getLearnerDetail/:userid", getLearnerDetail.getLearnerDetail);
router.post('/verifyLearner/:userid', verifyLearner.verifyLearner);

module.exports = router;