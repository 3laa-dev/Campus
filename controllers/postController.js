const Post = require("../models/postModel");
const factory = require("./handlersFactory");


const asyncHandler = require("express-async-handler");


exports.createPost = factory.createOne(Post);

// Gönderiyi paylaşan kullanıcının bilgilerini (user) doldurarak getiriyoruz
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().populate("user");
    res.status(200).json({ status: "succses", data: posts });
});

// Belirli bir gönderiyi detayları ve paylaşan kullanıcı bilgileriyle getiriyoruz
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate("user");
    res.status(200).json({ status: "succses", data: post });
});

exports.updatePost = factory.updateOne(Post);

exports.deletePost = factory.deleteOne(Post);