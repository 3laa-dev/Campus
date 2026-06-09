const User = require("../models/userModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");



exports.getAllUsers =  factory.getAll(User);

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select("-password -passwordResetCode -passwordResetExpires -passwordResetVerified");
    if (!user) {
        return next(new Error("User not found"));
    }
    res.status(200).json({ status: "succses", data: user });
});

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
    const allowedFields = ["name", "username", "title", "bio"];
    
    allowedFields.forEach(key => {
        if (req.body[key] !== undefined) {
            filteredBody[key] = req.body[key];
        }
    });

    // Profil resmi yalnızca yeni bir dosya yüklenirse güncellenir
    if (req.file) {
        filteredBody.profileImage = req.file.filename;
    } else if (req.body.profileImage === "delete" || req.body.profileImage === null) {
        filteredBody.profileImage = null;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    }).select("-password");

    res.status(200).json({
        status: "succses",
        data: updatedUser
    });
});


