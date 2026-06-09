const factory = require("./handlersFactory");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const asyncHandler = require("express-async-handler");


exports.createComment = factory.createOne(Comment);
exports.getAllCommentsOnPost = asyncHandler(async(req , res , next)=>{
    // Gönderiye yapılan yorumları, yorumu yapan kullanıcı bilgileriyle (user) doldurarak getiriyoruz
    const comments = await Comment.find({post : req.params.id}).populate("user");
    res.status(200).json({ status: "succses", data: comments })
});

exports.toggleCommentSolution = asyncHandler(async(req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        return res.status(404).json({ status: "fail", message: "Comment not found" });
    }

    const post = await Post.findById(comment.post);
    if (!post) {
        return res.status(404).json({ status: "fail", message: "Post not found" });
    }

    // Check if the current user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: "fail", message: "Only the post owner can mark solutions" });
    }

    // Toggle this comment's isSolution
    comment.isSolution = !comment.isSolution;
    await comment.save();

    // Update post solved status based on if any comments are solutions
    const anySolutions = await Comment.exists({ post: post._id, isSolution: true });
    post.solved = !!anySolutions;
    await post.save();

    res.status(200).json({
        status: "success",
        data: {
            comment,
            postSolved: post.solved
        }
    });
});