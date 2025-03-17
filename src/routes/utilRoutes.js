const express = require("express");
const { getListCategories } = require("../utils/getCategories");

const router = express.Router();

// Sử dụng các controller như một hàm callback
router.get("/getCategories", getCategories);

async function getCategories(req, res) {
    try {
        const categories = await getListCategories(req.query);
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = router;