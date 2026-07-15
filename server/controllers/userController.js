const User = require("../models/User");


// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password");

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

        const user = await User.findById(req.params.id)
            .select("-password");


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
            success:false,
            message:error.message
        });

    }
};



// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req,res)=>{

    try{

        const user = await User.findByIdAndDelete(req.params.id);


        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }


        res.status(200).json({
            success:true,
            message:"User deleted successfully"
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};