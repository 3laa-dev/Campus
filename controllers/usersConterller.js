const User = require("../models/userModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");



exports.getAllUsers =  factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

// Get currently logged-in user profile details
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ status: "succses", data: user });
});

// Update currently logged-in user profile details
exports.updateMe = asyncHandler(async (req, res, next) => {
    // Filter allowed update fields
    const filteredBody = {};
    const allowedFields = ["name", "username", "title", "bio", "profileImage"];
    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            filteredBody[key] = req.body[key];
        }
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    }).select("-password");

    res.status(200).json({
        status: "succses",
        data: updatedUser
    });
});


