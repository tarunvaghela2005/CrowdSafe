const User = require("../models/User");
const Report = require("../models/Report");
const Notification = require("../models/Notification");

// Dashboard Statistics
const getAdminDashboard = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalReports = await Report.countDocuments();

        const pendingReports = await Report.countDocuments({
            status: "Pending"
        });

        const verifiedReports = await Report.countDocuments({
            status: "Verified"
        });

        const resolvedReports = await Report.countDocuments({
            status: "Resolved"
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalReports,
                pendingReports,
                verifiedReports,
                resolvedReports
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Get All Users
const getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const searchUsers = async (req, res) => {
    try {

        const keyword = req.query.keyword || "";

        const users = await User.find({
            $or: [
                {
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    role: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const changeUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { role } = req.body;

        // Only allow valid roles
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get All Reports
const getAllReports = async (req, res) => {
    try {

        const reports = await Report.find()
            .populate("reportedBy", "name email")
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Search Reports
const searchReports = async (req, res) => {
    try {

        const keyword = req.query.keyword || "";

        const reports = await Report.find({
            $or: [
                {
                    title: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    "location.address": {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ]
        })
            .populate("reportedBy", "name email")
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Filter Reports
const filterReports = async (req, res) => {
    try {

        const { status, priority, category } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }

        if (category) {
            filter.category = category;
        }

        const reports = await Report.find(filter)
            .populate("reportedBy", "name email")
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const filterReportsByStatus = async (req, res) => {
    try {

        const { status } = req.query;

        const reports = await Report.find({
            status: status
        })
            .populate("category", "name")
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const filterReportsByCategory = async (req, res) => {
    try {

        const { category } = req.query;

        const reports = await Report.find({
            category: category
        })
            .populate("category", "name")
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const filterReportsByPriority = async (req, res) => {
    try {

        const { priority } = req.query;

        const reports = await Report.find({
            priority
        })
            .populate("category", "name")
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Report Details
const getReportDetails = async (req, res) => {
    try {

        const report = await Report.findById(req.params.id)
            .populate("category", "name")
            .populate("reportedBy", "name email");

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Verify Report
const verifyReport = async (req, res) => {
    try {

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        report.status = "Verified";

        await Notification.create({
            user: report.reportedBy,
            title: "Report Verified",
            message: `Your report "${report.title}" has been verified by the admin.`,
            type: "Success"
        });



        await report.save();

        res.status(200).json({
            success: true,
            message: "Report verified successfully",
            data: report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Reject Report
const rejectReport = async (req, res) => {
    try {

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        report.status = "Rejected";

        await report.save();

        await Notification.create({
            user: report.reportedBy,
            title: "Report Rejected",
            message: `Your report "${report.title}" has been rejected by the admin.`,
            type: "Warning"
        });
        
        res.status(200).json({
            success: true,
            message: "Report rejected successfully",
            data: report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// Delete Report (Admin)
const deleteReportByAdmin = async (req, res) => {
    try {

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        await Report.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Report deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Export Controllers
module.exports = {
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

};