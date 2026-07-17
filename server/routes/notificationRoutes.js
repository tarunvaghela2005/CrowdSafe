const express = require("express");
const router = express.Router();

const {
    createNotification,
    getMyNotifications,
    markNotificationAsRead,
    deleteNotification
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");


// Create Notification
router.post(
    "/",
    authMiddleware,
    createNotification
);


// Get Logged-in User Notifications
router.get(
    "/",
    authMiddleware,
    getMyNotifications
);


// Mark Notification as Read
router.patch(
    "/:id/read",
    authMiddleware,
    markNotificationAsRead
);


// Delete Notification
router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);

module.exports = router;