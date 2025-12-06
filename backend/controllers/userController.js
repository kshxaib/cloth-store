import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address) {
        updateData.address = {
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            pincode: address.pincode || '',
        };
    }

    // Use findByIdAndUpdate to avoid password hashing middleware
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
    );

    res.json({
        success: true,
        user: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            address: updatedUser.address,
        },
    });
});
