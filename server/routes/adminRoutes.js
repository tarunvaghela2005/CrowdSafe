const express = require("express");
const router = express.Router();

const {
    getAdminDashboard,
    getAllUsers,
    searchUsers,
    changeUserRole,
    deleteUser,
    getAllReports,
    searchReports,
    filterReports,
    filterReportsByStatus,
    filterReportsByCategory,
    filterReportsByPriority,
    getReportDetails,
    verifyReport,
    rejectReport,
    deleteReportByAdmin
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/users/search",
    authMiddleware,
    roleMiddleware("admin"),
    searchUsers
);

router.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
);

router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("admin"),
    getAdminDashboard
);

router.patch(
    "/users/:id/role",
    authMiddleware,
    roleMiddleware("admin"),
    changeUserRole
);

router.delete(
    "/users/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteUser
);

router.get(
    "/reports/search",
    authMiddleware,
    roleMiddleware("admin"),
    searchReports
);

router.get(
    "/reports/filter",
    authMiddleware,
    roleMiddleware("admin"),
    filterReports
);

router.get(
    "/reports/filter/priority",
    authMiddleware,
    roleMiddleware("admin"),
    filterReportsByPriority
);

// Filter by Status
router.get(
    "/reports/filter/status",
    authMiddleware,
    roleMiddleware("admin"),
    filterReportsByStatus
);

// Filter by Category
router.get(
    "/reports/filter/category",
    authMiddleware,
    roleMiddleware("admin"),
    filterReportsByCategory
);

router.get(
    "/reports/:id",
    authMiddleware,
    roleMiddleware("admin"),
    getReportDetails
);
router.patch(
    "/reports/:id/verify",
    authMiddleware,
    roleMiddleware("admin"),
    verifyReport
);

router.patch(
    "/reports/:id/reject",
    authMiddleware,
    roleMiddleware("admin"),
    rejectReport
);

router.delete(
    "/reports/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteReportByAdmin
);

router.get(
    "/reports",
    authMiddleware,
    roleMiddleware("admin"),
    getAllReports,
);


module.exports = router;