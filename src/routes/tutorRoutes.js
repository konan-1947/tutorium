const express = require("express");

const getTutorDetail = require("../controllers/tutor/getTutorProfileController");
const registerTutor = require("../controllers/tutor/registerTutorController");

const workingTimeController = require('../controllers/tutor/createWorkingTimeTutorController');
const getListPendingController = require('../controllers/tutor/getListPendingBookingController');
const getDetailPendingController = require('../controllers/tutor/getDetailPendingBookingController');
const approveContractController = require('../controllers/tutor/approveContractPendingController');

const getListFollow = require('../controllers/tutor/getListLearnerFollowerController');

const updateTutorAccProfile = require('../controllers/tutor/updateTutorProfileController');

const deleteTutorAccProfile = require('../controllers/tutor/deleteTutorProfileController');

const getTutorWk = require('../controllers/tutor/getWorkingTimeController');

const changeVerifyAtTutor = require('../controllers/tutor/changeVerifyAtTutorController');

const getListCompletedContract = require('../controllers/tutor/getListCompletedContractController');


const tutorDoneContract = require('../controllers/tutor/doneContractByTutorController');




const createAccomplishmentss = require('../controllers/tutor/createAccomplishmentTutorController');

const getDetailAccomplishments = require('../controllers/tutor/getDetailAccomplishmentTutorController');

const getListAccomplishments = require('../controllers/tutor/getListAccomplishmentTutorController');


const updateAccomplishments = require('../controllers/tutor/updateAccomplishmentTutorController');

const deleteAccomplishments = require('../controllers/tutor/deleteAccomplishmentTutorController');

const router = express.Router();

// Sử dụng các controller như một hàm callback

router.get("/getTutorDetail/:userid", getTutorDetail.getTutorDetail);
router.post("/registerTutor", registerTutor.registerTutor);
router.post('/createWorkingTime', workingTimeController.createWorkingTime);

router.get('/getListPendingBooking', getListPendingController.getPendingBookings);

router.get('/getDetailPendingBooking/:contractId', getDetailPendingController.getPendingBookingDetails)

router.put("/approveContract/:contractId", approveContractController.approvePendingBooking)

router.get('/getListFollower/:username', getListFollow.getLearnerFollowers);

router.put('/updateTutorProfile', updateTutorAccProfile.updateTutorProfile);

router.delete('/deleteTutorProfile', deleteTutorAccProfile.deleteTutorAccount);

router.get('/getTutorWorkingTimes', getTutorWk.getTutorWorkingTimes);

router.post('/changeVerifyAtTutor', changeVerifyAtTutor.confirmVerifyToken);


// Lấy danh sách hợp đồng completed  của tutor 
router.get('/getListCompletedContract', getListCompletedContract.getListCompletedContracts);

// Xác nhận done hợp đồng
router.put('/doneContractByTutor/:contractId', tutorDoneContract.doneContract);



//CRUD Accomplishment (Tutor)
router.post('/createAccomplishmentTutor', createAccomplishmentss.createAccomplishment);

router.get('/getListAccomplishmentTutor', getListAccomplishments.getTutorAccomplishments);

router.get('/getDetailAccomplishmentTutor/:accomplishmentid', getDetailAccomplishments.getTutorAccomplishments);

router.delete('/deleteAccomplishmentTutor/:accomplishmentid',deleteAccomplishments.deleteAccomplishment );

router.put('/updateAccomplishmentTutor/:accomplishmentid',updateAccomplishments.updateAccomplishment);

module.exports = router;