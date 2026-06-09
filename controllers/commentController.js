const factory = require("./handlersFactory");
const Comment = require("../models/commentModel");
const asyncHandler = require("express-async-handler");


exports.createComment = factory.createOne(Comment);
exports.getAllCommentsOnPost = asyncHandler(async(req , res , next)=>{
    // Gönderiye yapılan yorumları, yorumu yapan kullanıcı bilgileriyle (user) doldurarak getiriyoruz
    const comments = await Comment.find({post : req.params.id}).populate("user");
    res.status(200).json({ status: "succses", data: comments })
})