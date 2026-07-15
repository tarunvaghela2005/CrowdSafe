const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            required: true,
            trim: true,
        },

        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);