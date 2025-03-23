const express = require("express");
const searchTutorController = require("../controllers/learner/searchTutorController");
const getLearnerDetail = require("../controllers/learner/getLearnerProfileController");
const chooseCustomInfoForLearner  = require('../controllers/learner/chooseCustomInfoForLearnerController');
const changeVerifiedAt  = require('../controllers/learner/changeVerifiedAtController');

const followController = require("../controllers/learner/followTutorController");
const unFollowController = require("../controllers/learner/unFollowTutorController");

const getTutorDetail = require("../controllers/learner/getTutorDetailController");
const getTutorWk = require('../controllers/learner/getTutorWorkingTimeController');

const createLearnerBooking = require('../controllers/learner/createLearnerBookingController');

const getListTutorFollow = require('../controllers/learner/getListTutorFollowController');


const router = express.Router();


// Sử dụng các controller như một hàm callback
router.get("/findTutor", searchTutorController);
router.get("/getLearnerDetail", getLearnerDetail.getLearnerDetail); //Xem profile cá nhân. 

router.post('/chooseCustomInfo', chooseCustomInfoForLearner.chooseCustomInfoForLearner);
router.get('/changeVerifiedAt',changeVerifiedAt.changeVerifiedAt)

router.get("/getTutorDetail/:username", getTutorDetail.getTutorDetail);

router.post("/follow", followController.followTutor);
router.delete("/unfollow", unFollowController.unfollowTutor);

router.get('/getTutorWorkingTimes/:username', getTutorWk.getTutorWorkingTimes);

router.post('/bookingContract/:username', createLearnerBooking.bookingContract);

router.get('/getListTutorFollow', getListTutorFollow.getFollowedTutors);

module.exports = router;