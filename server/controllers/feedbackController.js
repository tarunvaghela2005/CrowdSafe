const Feedback = require("../models/Feedback");


// @desc    Submit Feedback
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = async (req, res) => {

    try {

        const { rating, subject, message } = req.body;

        if (!rating || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide rating, subject and message"
            });
        }

        const feedback = await Feedback.create({
            user: req.user.id,
            rating,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// @desc    Get My Feedback
// @route   GET /api/feedback/my
// @access  Private
exports.getMyFeedback = async (req, res) => {

    try {

        const feedback = await Feedback.find({
            user: req.user.id
        })
            .populate("user", "-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedback.length,
            data: feedback
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// @desc    Get All Feedback
// @route   GET /api/feedback
// @access  Admin
exports.getAllFeedback = async (req, res) => {

    try {

        const feedback = await Feedback.find()
            .populate("user", "-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedback.length,
            data: feedback
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// @desc    Update Feedback Status
// @route   PATCH /api/feedback/:id/status
// @access  Admin
exports.updateFeedbackStatus = async (req, res) => {

    try {

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("user", "-password");

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback status updated successfully",
            data: feedback
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// @desc    Delete Feedback
// @route   DELETE /api/feedback/:id
// @access  Admin
exports.deleteFeedback = async (req, res) => {

    try {

        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        await Feedback.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};