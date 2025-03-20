const express = require('express');
const router = express.Router();

//
const getListAdmin = require('../controllers/admin/getListAdminController');

//
const getLearnerList = require('../controllers/admin/controllers-admin-learner/getLearnerListController');
const getLearnerDetail = require('../controllers/admin/controllers-admin-learner/getLearnerDetailController');
const updateLearner = require('../controllers/admin/controllers-admin-learner/updateLearnerController');


//
const getCategoryList = require('../controllers/admin/controllers-admin-category/getCategoryListController');
const createCategory = require('../controllers/admin/controllers-admin-category/createCategoryController');
const updateCategory = require('../controllers/admin/controllers-admin-category/updateCategoryController');
const deleteCategory = require('../controllers/admin/controllers-admin-category/deleteCategoryController');

//
const getTutorList = require('../controllers/admin/controllers-admin-tutor/getTutorListController');
const getTutorDetail = require('../controllers/admin/controllers-admin-tutor/getTutorDetailController');
const updateTutor = require('../controllers/admin/controllers-admin-tutor/updateTutorController');


// Phan cua Admin 
router.get('/getAdminList', getListAdmin.getAdminList);

//Phan cua Tutors 
router.get('/getTutorList', getTutorList.getTutors); // api view list tutor 

router.get('/getTutorDetail/:userid', getTutorDetail.getTutorDetail);

router.put('/updateTutor/:userid', updateTutor.updateTutor);


//Phan cua Learner
router.get('/getLearnerList', getLearnerList.getLearner); // api view list learner

router.get('/getLearnerDetail/:userid', getLearnerDetail.getLearnerDetail);

router.put('/updateLearner/:userid', updateLearner.updateLearner);


//Phan cua Category
router.get('/getCategoryList', getCategoryList.getCategoryList);

router.post("/createCategory", createCategory.createCategory);

router.put("/updateCategory/:categoryid", updateCategory.updateCategory);

router.delete("/deleteCategory/:categoryid", deleteCategory.deleteCategory)

module.exports = router;
