const express = require("express");
const searchTutorController = require("../controllers/tutor/searchTutorController");

const router = express.Router();

router.get("/search", searchTutorController);

module.exports = router;
