const express = require("express");

const getTutorDetail = require("../controllers/tutor/getTutorProfileController");

const router = express.Router();

// Sử dụng các controller như một hàm callback

router.get("/getTutorDetail/:userid", getTutorDetail.getTutorDetail);

module.exports = router;