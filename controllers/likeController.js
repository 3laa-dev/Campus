const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Like = require("../models/likeModel")


exports.addLike = factory.createOne(Like);
exports.removeLike = factory.deleteOne(Like);
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