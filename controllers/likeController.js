const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Like = require("../models/likeModel")


exports.addLike = factory.createOne(Like);
exports.removeLike = asyncHandler(async (req, res, next) => {
    const result = await Like.findOneAndDelete({ user: req.user._id, post: req.params.id });
    if (!result) {
        // Fallback to delete by Like ID just in case
        await Like.findByIdAndDelete(req.params.id);
    }
    res.status(200).json({ status: "success" });
});
exports.isLiked = asyncHandler(async (req, res, next) => {
    const like = await Like.findOne({ user: req.user._id , post:req.params.id});
    if (like)
        res.json({ isLiked: true })
    else
        res.json({ isLiked: false })
})
exports.getLikesOnPost =  asyncHandler(async (req, res, next) => {
    const likes = await Like.find({  post:req.params.id});
    res.json(likes)
})