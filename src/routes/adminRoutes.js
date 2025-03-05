const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const tutorController = require('../controllers/admin/tutorController');
const learnerController = require('../controllers/admin/learnerController');
const categoryController = require('../controllers/admin/categoryController');

// Phan cua Admin 
router.get('/adminList', adminController.getAdminList);

//Phan cua Tutors 
router.get('/tutorList', tutorController.getTutors); // api view list tutor 

router.get('/tutorDetail/:userid', tutorController.getTutorDetail);

router.put('/updateTutor/:userid', tutorController.updateTutor);


//Phan cua Learner
router.get('/learnerList', learnerController.getLearner); // api view list learner

router.get('/learnerDetail/:userid', learnerController.getLearnerDetail);

router.put('/updateLearner//:userid', learnerController.updateLearner);


//Phan cua Category
router.get('/categoryList', categoryController.getCategoryList);

router.post("/createCategory", categoryController.createCategory);

router.put("/updateCategory/:categoryid", categoryController.updateCategory);

router.delete("/deleteCategory/:categoryid", categoryController.deleteCategory)

module.exports = router;
