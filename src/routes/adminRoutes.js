const express = require('express');
const router = express.Router();

//Admin 
const getListAdmin = require('../controllers/admin/controllers-admin-admin/getListAdminController');
const updateAdmin = require('../controllers/admin/controllers-admin-admin/updateAdminController');
const createAdmin = require('../controllers/admin/controllers-admin-admin/createAdminController');
const deleteAdmin = require('../controllers/admin/controllers-admin-admin/deleteAdminController');
const getListVerify = require('../controllers/admin/controllers-admin-tutor/getListTutorVerifyController');

//
const getLearnerList = require('../controllers/admin/controllers-admin-learner/getLearnerListController');
const getLearnerDetail = require('../controllers/admin/controllers-admin-learner/getLearnerDetailController');
const updateLearner = require('../controllers/admin/controllers-admin-learner/updateLearnerController');
const deleteLearner = require('../controllers/admin/controllers-admin-learner/deleteLearnerController');


//
const getCategoryList = require('../controllers/admin/controllers-admin-category/getCategoryListController');
const createCategory = require('../controllers/admin/controllers-admin-category/createCategoryController');
const updateCategory = require('../controllers/admin/controllers-admin-category/updateCategoryController');
const deleteCategory = require('../controllers/admin/controllers-admin-category/deleteCategoryController');

//
const getTutorList = require('../controllers/admin/controllers-admin-tutor/getTutorListController');
const getTutorDetail = require('../controllers/admin/controllers-admin-tutor/getTutorDetailController');
const updateTutor = require('../controllers/admin/controllers-admin-tutor/updateTutorController');
const verifyTutor = require('../controllers/admin/controllers-admin-tutor/verifyTutorController');
const deleteTutor = require('../controllers/admin/controllers-admin-tutor/deleteTutorController');
const getListAccomplishment = require('../controllers/admin/controllers-admin-tutor/getListAccomplishmentPendingTutorController');
const approveAccomplishmentTutor = require('../controllers/admin/controllers-admin-tutor/approveAccomplishmentTutorController');


// Phan cua Admin 
router.get('/getAdminList', getListAdmin.getAdminList);

router.post('/createAdmin', createAdmin.createAdmin);

router.put('/updateAdmin/:userid', updateAdmin.updateUser);

router.delete('/deleteAdmin/:userid', deleteAdmin.deleteAdmin);

router.get('/getUnverifiedList',getListVerify.getListUnverifiedTutors);



//Phan cua Tutors 
router.get('/getTutorList', getTutorList.getTutors); // api view list tutor 

router.get('/getTutorDetail/:userid', getTutorDetail.getTutorDetail);

router.put('/updateTutor/:userid', updateTutor.updateTutor);

router.put('/verifyTutor/:userid', verifyTutor.verifyTutor); // Route để admin verify tutor

router.delete('/deleteTutor/:userid', deleteTutor.deleteTutorAccount);

router.get('/getListAccomplishmentPending', getListAccomplishment.getPendingAccomplishments)

// Route để admin duyệt hoặc từ chối accomplishment
router.put('/approveAccomplishmentPending/:accomplishmentid', approveAccomplishmentTutor.reviewAccomplishment);


//Phan cua Learner
router.get('/getLearnerList', getLearnerList.getLearner); // api view list learner

router.get('/getLearnerDetail/:userid', getLearnerDetail.getLearnerDetail);

router.put('/updateLearner/:userid', updateLearner.updateLearner);

router.delete('/deleteLearner/:userid', deleteLearner.deleteLearnerAccount);


//Phan cua Category
router.get('/getCategoryList', getCategoryList.getCategoryList);

router.post("/createCategory", createCategory.createCategory);

router.put("/updateCategory/:categoryid", updateCategory.updateCategory);

router.delete("/deleteCategory/:categoryid", deleteCategory.deleteCategory)

module.exports = router;
