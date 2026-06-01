const factory = require("./handlersFactory");
const Comment = require("../models/commentModel");
const asyncHandler = require("express-async-handler");


exports.createComment = factory.createOne(Comment);
exports.getAllCommentsOnPost = asyncHandler(async(req , res , next)=>{
    const comments = await Comment.find({post : req.params.id});
     res.status(200).json({ status: "succses", data: comments })
})