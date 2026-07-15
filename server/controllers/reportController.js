const Report = require("../models/Report");


// Create Report
const createReport = async (req, res) => {
    try {

        console.log("========== Create Report Request ==========");
        console.log("Body:", req.body);


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
            reportedBy,
            location,
            priority
        } = req.body;


        if (!title || !description || !category || !location) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }


        const report = await Report.create({
            title,
            description,
            category,
            reportedBy,
            location,
            priority
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
            .populate("reportedBy")
            .sort({ createdAt: -1 });


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
            .populate("reportedBy");


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

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
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
            message: "Report updated successfully",
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

        const report = await Report.findByIdAndDelete(req.params.id);


        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }


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
    deleteReport
};