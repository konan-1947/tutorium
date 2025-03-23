const express = require("express");

const getTutorDetail = require("../controllers/tutor/getTutorProfileController");
const registerTutor =  require("../controllers/tutor/registerTutorController");

const workingTimeController = require('../controllers/tutor/createWorkingTimeTutorController');
const getListPendingController = require('../controllers/tutor/getListPendingBookingController');
const getDetailPendingController = require('../controllers/tutor/getDetailPendingBookingController');
const approveContractController = require('../controllers/tutor/approveContractPendingController');

const getListFollow = require('../controllers/tutor/getListLearnerFollowerController');

const router = express.Router();

// Sử dụng các controller như một hàm callback

router.get("/getTutorDetail/:userid", getTutorDetail.getTutorDetail);
router.post("/registerTutor", registerTutor.registerTutor);
router.post('/createWorkingTime', workingTimeController.createWorkingTime);

router.get('/getListPendingBooking', getListPendingController.getPendingBookings );

router.get('/getDetailPendingBooking/:contractId',getDetailPendingController.getPendingBookingDetails)

router.put("/approveContract/:contractId",approveContractController.approvePendingBooking)

router.get('/getListFollower/:username', getListFollow.getLearnerFollowers);


module.exports = router;