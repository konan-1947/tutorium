const express = require("express");

const getTutorDetail = require("../controllers/tutor/getTutorProfileController");
const registerTutor =  require("../controllers/tutor/registerTutorController");

const router = express.Router();

// Sử dụng các controller như một hàm callback

router.get("/getTutorDetail/:userid", getTutorDetail.getTutorDetail);
router.post("/registerTutor", registerTutor.registerTutor);

module.exports = router;