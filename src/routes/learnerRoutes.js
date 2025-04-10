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
const getAllContract = require('../controllers/learner/getAllContractController');
const updateProfileLearner = require('../controllers/learner/updateLearnerProfileController');

const deleteProfileLearner = require('../controllers/learner/deleteLearnerAccountProfileController');
const router = express.Router();
const getListActiveContract = require('../controllers/learner/getListActiveContractController');
const learnerCompletedContract = require('../controllers/learner/completedContractByLearnerController');
const watchListAccom = require('../controllers/learner/watchListAccomplishmentController');

const watchDetailAccom = require('../controllers/learner/watchDetailAccomplishmentController');


// Sử dụng các controller như một hàm callback

router.put('/updateProfileLearner', updateProfileLearner.updateLearnerProfile);

router.delete('/deleteLearnerAccountProfile', deleteProfileLearner.deleteLearnerAccount);
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

router.get('/getAllContract', getAllContract.getAllContract);

router.put('/completedContractByLearner/:contractId', learnerCompletedContract.completeContract);
router.get('/getListActiveContract', getListActiveContract.getListActiveContracts);



// Route để learner xem list accomplishments verified của một tutor
router.get('/watchListAccomplishment/:username', watchListAccom.getTutorVerifiedAccomplishments);

// Route để learner xem detail  accomplishments verified của một tutor
router.get('/watchDetailAccomplishment/:accomplishmentid', watchDetailAccom.getTutorVerifiedAccomplishments);


module.exports = router;