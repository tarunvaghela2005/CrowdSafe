const User = require("../models/User");
const Report = require("../models/Report");

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );
        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
exports.getUserById = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        res.status(200).json({
            success: true,
            data: user
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Admin
exports.updateUserRole = async (req, res) => {

    try {

        const { role } = req.body;


        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            {
                new: true
            }
        ).select("-password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


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



// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(req.params.id);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


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
// @desc    User Dashboard
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {

    try {

        // Logged-in user
        const user = await User.findById(req.user.id).select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );

        // Statistics
        const totalReports = await Report.countDocuments({
            reportedBy: req.user.id
        });

        const pendingReports = await Report.countDocuments({
            reportedBy: req.user.id,
            status: "Pending"
        });

        const verifiedReports = await Report.countDocuments({
            reportedBy: req.user.id,
            status: "Verified"
        });

        const resolvedReports = await Report.countDocuments({
            reportedBy: req.user.id,
            status: "Resolved"
        });

        // Recent Reports
        const recentReports = await Report.find({
            reportedBy: req.user.id
        })
            .populate("category")
            .populate("reportedBy", "-password")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                user,
                statistics: {
                    totalReports,
                    pendingReports,
                    verifiedReports,
                    resolvedReports
                },
                recentReports
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// @desc    Get Logged-in User Report History
// @route   GET /api/users/reports
// @access  Private

exports.getUserReports = async (req, res) => {
    console.log("🔥 USER REPORT ROUTE HIT");
    console.log("Logged User:", req.user);

    try {

        const reports = await Report.find({
            reportedBy: req.user.id
        })
            .populate("category")
            .populate(
                "reportedBy",
                "name email role"
            )
            .sort({ createdAt: -1 });


        console.log("Reports Found:", reports.length);
        console.log(reports);


        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// @desc    Search User Reports
// @route   GET /api/users/reports/search
// @access  Private

exports.searchUserReports = async (req, res) => {

    try {

        const { keyword, status } = req.query;

        // Logged-in user's reports only
        const query = {
            reportedBy: req.user.id
        };

        // Search by title or description
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        const reports = await Report.find(query)
            .populate("category")
            .populate("reportedBy", "-password")
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

exports.getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.updateProfile = async (req, res) => {
    try {

        const { name, phone } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;

        await user.save();

        // Fetch updated user without sensitive fields
        const updatedUser = await User.findById(req.user.id).select(
            "-password -resetPasswordToken -resetPasswordExpire"
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};