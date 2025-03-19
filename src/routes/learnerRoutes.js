const express = require("express");
const searchTutorController = require("../controllers/learner/searchTutorController");
const getLearnerDetail = require("../controllers/learner/getLearnerProfileController");
const verifyLearner  = require('../controllers/learner/verifyLearnerController');

const followController = require("../controllers/learner/followTutorController");
const unFollowController = require("../controllers/learner/unFollowTutorController");

const getTutorDetail = require("../controllers/learner/getTutorDetailController");

const router = express.Router();


// Sử dụng các controller như một hàm callback
router.get("/findTutor", searchTutorController);
router.get("/getLearnerDetail/:userid", getLearnerDetail.getLearnerDetail); //Xem profile cá nhân. 
router.post('/verifyLearner/:userid', verifyLearner.verifyLearner);

router.get("/getTutorDetail/:userid", getTutorDetail.getTutorDetail);

router.post("/follow", followController.followTutor);
router.delete("/unfollow", unFollowController.unfollowTutor);


module.exports = router;