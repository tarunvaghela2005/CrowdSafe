const Notification = require("../models/Notification");

// Create Notification
const createNotification = async (req, res) => {
    try {

        const notification = await Notification.create({
            user: req.body.user,
            title: req.body.title,
            message: req.body.message,
            type: req.body.type
        });

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: notification
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Logged-in User Notifications
const getMyNotifications = async (req, res) => {
    try {

        const notifications = await Notification.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Mark Notification as Read
const markNotificationAsRead = async (req, res) => {
    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // Prevent users from updating others' notifications
        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Notification
const deleteNotification = async (req, res) => {
    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // Prevent users from deleting others' notifications
        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        await Notification.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createNotification,
    getMyNotifications,
    markNotificationAsRead,
    deleteNotification
};