const express = require("express");

const controller = require("../controllers/reportController");

console.log("Controller Loaded:", controller);

const {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport
} = controller;


const router = express.Router();


router.post("/", createReport);

router.get("/", getReports);

router.get("/:id", getReportById);

router.put("/:id", updateReport);

router.delete("/:id", deleteReport);


module.exports = router;