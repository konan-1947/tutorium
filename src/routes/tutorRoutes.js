const express = require("express");
//CRUD tutor Category 
const selectCategory = require('../controllers/tutor/selectCategoryTutorController');
const getListCategory = require('../controllers/tutor/getListCategoryTutorController');
const createCategory = require('../controllers/tutor/createCategoryTutorController');
const deleteCategories = require('../controllers/tutor/deleteCategoryTutorController');

const getTutorDetail = require("../controllers/tutor/getTutorProfileController");

const workingTimeController = require('../controllers/tutor/createWorkingTimeTutorController');
const getListPendingController = require('../controllers/tutor/getListPendingBookingController');
const getDetailPendingController = require('../controllers/tutor/getDetailPendingBookingController');
const approveContractController = require('../controllers/tutor/approveContractPendingController');
const changeVerifyAtTutor = require('../controllers/tutor/changeVerifyAtTutorController');
const getListFollow = require('../controllers/tutor/getListLearnerFollowerController');
const updateTutorAccProfile = require('../controllers/tutor/updateTutorProfileController');
const verifyTutor = require('../controllers/admin/controllers-admin-tutor/verifyTutorController');
const deleteTutorAccProfile = require('../controllers/tutor/deleteTutorProfileController');
const router = express.Router();

const getListCompletedContract = require('../controllers/tutor/getListCompletedContractController');
const tutorDoneContract = require('../controllers/tutor/doneContractByTutorController');
exports.router = router;

//CRUD Accomplishment (Tutor)

const createAccomplishmentss = require('../controllers/tutor/createAccomplishmentTutorController');

const getDetailAccomplishments = require('../controllers/tutor/getDetailAccomplishmentTutorController');

const getListAccomplishments = require('../controllers/tutor/getListAccomplishmentTutorController');


const updateAccomplishments = require('../controllers/tutor/updateAccomplishmentTutorController');

const deleteAccomplishments = require('../controllers/tutor/deleteAccomplishmentTutorController');
const getTutorWk = require('../controllers/tutor/getWorkingTimeController');

router.get('/getTutorWorkingTimes', getTutorWk.getTutorWorkingTimes);

router.get("/getTutorDetail", getTutorDetail.getTutorDetail);
router.post('/createWorkingTime', workingTimeController.createWorkingTime);

router.get('/getListPendingBooking', getListPendingController.getPendingBookings );

router.get('/getDetailPendingBooking/:contractId',getDetailPendingController.getPendingBookingDetails)

router.put("/approveContract/:contractId",approveContractController.approvePendingBooking)

router.get('/getListFollower/:username', getListFollow.getLearnerFollowers);
router.put('/updateTutorProfile', updateTutorAccProfile.updateTutorProfile);

router.delete('/deleteTutorProfile', deleteTutorAccProfile.deleteTutorAccount);
router.post('/changeVerifyAtTutor', changeVerifyAtTutor.confirmVerifyToken);
router.get('/getListCompletedContract', getListCompletedContract.getListCompletedContracts);
// Xác nhận done hợp đồng
router.put('/doneContractByTutor/:contractId', tutorDoneContract.doneContract);

//acc
router.post('/createAccomplishmentTutor', createAccomplishmentss.createAccomplishment);

router.get('/getListAccomplishmentTutor', getListAccomplishments.getTutorAccomplishments);

router.get('/getDetailAccomplishmentTutor/:accomplishmentid', getDetailAccomplishments.getTutorAccomplishments);

router.delete('/deleteAccomplishmentTutor/:accomplishmentid',deleteAccomplishments.deleteAccomplishment );

router.put('/updateAccomplishmentTutor/:accomplishmentid',updateAccomplishments.updateAccomplishment );
//Category Tutor
router.post('/selectCategoryTutor',selectCategory.selectCategories);
router.get('/getListCategoryTutor',getListCategory.getTutorCategories);
router.post('/createCategoryTutor',createCategory.createCategory);
router.delete('/deleteCategoryTutor/:categoryId',deleteCategories.deleteCategory);

module.exports = router;