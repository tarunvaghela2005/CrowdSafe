const Report = require("../models/Report");
const cloudinary = require("../config/cloudinary");


// Create Report
const createReport = async (req, res) => {
    try {

        console.log("========== Create Report Request ==========");
        console.log("Body:", req.body);
        console.log("Files:", req.files);


        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing"
            });
        }


        const {
            title,
            description,
            category,
            location,
            priority
        } = req.body;


        if (!title || !description || !category || !location) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }



        // Upload Images to Cloudinary
        let imageUrls = [];


        if (req.files && req.files.length > 0) {

            for (let file of req.files) {

                const result = await cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                    {
                        folder: "CrowdSafe/Reports"
                    }
                );


                imageUrls.push(result.secure_url);
            }
        }



        // Create Report
        const report = await Report.create({

            title,
            description,
            category,
            reportedBy: req.user.id,
            location,
            priority,

            images: imageUrls

        });



        res.status(201).json({

            success: true,
            message: "Report created successfully",
            data: report

        });



    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });
    }
};




// Get All Reports
const getReports = async (req, res) => {

    try {

        const reports = await Report.find()
            .populate("category")
            .populate("reportedBy", "-password")



        res.status(200).json({

            success: true,
            count: reports.length,
            data: reports

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });
    }
};




// Get Single Report
const getReportById = async (req, res) => {

    try {

        const report = await Report.findById(req.params.id)
            .populate("category")
            .populate("reportedBy", "-password");


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

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });
    }
};

// Update Report
const updateReport = async (req, res) => {

    try {

        // Find the report
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        // Check ownership or admin
        if (
            report.reportedBy.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this report"
            });
        }

        // Update report
        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Report updated successfully",
            data: updatedReport
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Report Status
const updateReportStatus = async (req, res) => {

    try {

        // Only admin can update report status
        if (req.user.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Only admin can update report status"
            });

        }


        const report = await Report.findByIdAndUpdate(

            req.params.id,

            {
                status: req.body.status
            },

            {
                new: true,
                runValidators: true
            }

        );


        if (!report) {

            return res.status(404).json({

                success: false,
                message: "Report not found"

            });

        }


        res.status(200).json({

            success: true,
            message: "Report status updated successfully",
            data: report

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
// Delete Report
const deleteReport = async (req, res) => {

    try {

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        // Admin can delete any report
        if (req.user.role !== "admin") {

            // User can delete only their own report
            if (report.reportedBy.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to delete this report"
                });
            }

        }

        await Report.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Report deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



module.exports = {

    createReport,
    getReports,
    getReportById,
    updateReport,
    updateReportStatus,
    deleteReport,


};