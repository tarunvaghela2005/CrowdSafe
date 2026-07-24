const express = require("express");

const {
    createReport,
    getReports,
    getReportStatistics,
    getReportById,
    getMyReports,
    updateReport,
    updateReportStatus,
    deleteReport
} = require("../controllers/reportController");

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();
console.log("createReport:", typeof createReport);
console.log("getReports:", typeof getReports);
console.log("getReportById:", typeof getReportById);
console.log("updateReport:", typeof updateReport);
console.log("updateReportStatus:", typeof updateReportStatus);
console.log("deleteReport:", typeof deleteReport);

// Create Report
router.post(
    "/",
    authMiddleware,
    upload.array("images", 5),
    createReport
);

// Get All Reports
router.get("/", getReports);

router.get(
    "/statistics",
    authMiddleware,
    adminMiddleware,
    getReportStatistics
);

// Get logged-in user's reports
router.get(
    "/my-reports",
    authMiddleware,
    getMyReports
);

// Get Single Report
router.get("/:id", getReportById);

// Update Report
router.put("/:id", authMiddleware, updateReport);

// Update Report Status (Admin Only)
router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateReportStatus
);

// Delete Report (Admin Only)
router.delete(
    "/:id",
    authMiddleware,
    deleteReport
);

module.exports = router;