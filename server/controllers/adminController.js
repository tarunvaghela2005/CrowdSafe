const User = require("../models/User");
const Report = require("../models/Report");


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


    } catch(error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


module.exports = {
    getAdminDashboard
};