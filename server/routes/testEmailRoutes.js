const express = require("express");
const router = express.Router();

const sendEmail = require("../services/emailService");


router.get("/send-email", async (req, res) => {

    await sendEmail(
        "crowdsafe98@gmail.com",
        "CrowdSafe Test Email",
        "Email notification system is working!"
    );


    res.json({
        success: true,
        message: "Test email sent"
    });

});


module.exports = router;