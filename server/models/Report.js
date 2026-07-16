const mongoose = require("mongoose");
const Report = require("../models/Report");

const reportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        location: {
            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            },

            address: {
                type: String,
                default: ""
            }
        },

        images: [
            {
                type: String
            }
        ],

        status: {
            type: String,
            enum: [
                "Pending",
                "Verified",
                "Rejected",
                "Resolved"
            ],
            default: "Pending"
        },

        priority: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical"
            ],
            default: "Medium"
        },

        aiScore: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: true
    });


module.exports = mongoose.model("Report", reportSchema);