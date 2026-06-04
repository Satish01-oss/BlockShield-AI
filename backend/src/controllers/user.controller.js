const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
// GET PROFILE

async function getProfile(req, res) {

    try {

        const user = await userModel
            .findById(req.user.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'Profile fetched successfully',
            user
        });

    } catch (err) {

        console.log('Get Profile Error:', err.message);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}


// UPDATE PROFILE

async function updateProfile(req, res) {

    const {
        userName,
        email
    } = req.body;

    try {

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (userName) {
            user.userName = userName;
        }

        if (email) {
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {

        console.log('Update Profile Error:', err.message);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// CHANGE PASSWORD

async function changePassword(req, res) {

    const {
        currentPassword,
        newPassword
    } = req.body;

    try {

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            newPassword,
            salt
        );

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: 'Password changed successfully'
        });

    } catch (err) {

        console.log('Change Password Error:', err.message);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

// DELETE ACCOUNT

async function deleteAccount(req, res) {

    try {

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await userModel.findByIdAndDelete(req.user.id);

        res.clearCookie('token');

        res.status(200).json({
            message: 'Account deleted successfully'
        });

    } catch (err) {

        console.log('Delete Account Error:', err.message);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
};