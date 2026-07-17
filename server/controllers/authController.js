const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../services/emailService");


// Register User
exports.register = async (req, res) => {

    try {

        const { name, email, password } = req.body;


        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });


        res.status(201).json({
            success: true,

            message: "Registration successful",

            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });


    }
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// Login User
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }


        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }


        res.json({
            success: true,

            message: "Login successful",

            token: generateToken(user),

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });


    }
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Save token
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        // Reset link
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // Send email
        await sendEmail(
            user.email,
            "CrowdSafe Password Reset",
            `Hello ${user.name},

Click the link below to reset your password:

${resetUrl}

This link expires in 15 minutes.`
        );

        res.status(200).json({
            success: true,
            message: "Password reset email sent"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.resetPassword = async (req, res) => {
    try {

        const { token } = req.params;
        const { password } = req.body;

        // Find user by token and check expiry
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        user.password = hashedPassword;

        // Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};