const express = require("express");
const router = express.Router();

const {
    createFeedback,
    getMyFeedback,
    getAllFeedback,
    updateFeedbackStatus,
    deleteFeedback
} = require("../controllers/feedbackController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// Submit Feedback (User)
router.post(
    "/",
    protect,
    createFeedback
);


// Get My Feedback (User)
router.get(
    "/my",
    protect,
    getMyFeedback
);


// Get All Feedback (Admin)
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllFeedback
);


// Update Feedback Status (Admin)
router.patch(
    "/:id/status",
    protect,
    authorizeRoles("admin"),
    updateFeedbackStatus
);


// Delete Feedback (Admin)
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteFeedback
);


module.exports = router;