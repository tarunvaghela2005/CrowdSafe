const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");


const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// Get all users (Admin only)
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllUsers
);


// Get single user (Admin only)
router.get(
    "/:id",
    protect,
    authorizeRoles("admin"),
    getUserById
);


// Change user role (Admin only)
router.patch(
    "/:id/role",
    protect,
    authorizeRoles("admin"),
    updateUserRole
);


// Delete user (Admin only)
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteUser
);


module.exports = router;