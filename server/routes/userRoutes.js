const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getDashboard,
    getUserReports,
    searchUserReports,
    getProfile,
    updateProfile
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ================= USER ROUTES =================

// Dashboard
router.get("/dashboard", protect, getDashboard);

// Report History
router.get("/reports", protect, getUserReports);

// Search Reports
router.get("/reports/search", protect, searchUserReports);

// Profile
router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

// ================= ADMIN ROUTES =================

// Get all users
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllUsers
);

// Get single user
router.get(
    "/:id",
    protect,
    authorizeRoles("admin"),
    getUserById
);

// Update role
router.patch(
    "/:id/role",
    protect,
    authorizeRoles("admin"),
    updateUserRole
);

// Delete user
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteUser
);

module.exports = router;