const Post = require("../models/postModel");
const factory = require("./handlersFactory");


const asyncHandler = require("express-async-handler");


exports.createPost = factory.createOne(Post);

const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");

// Gönderiyi paylaşan kullanıcının bilgilerini (user) doldurarak getiriyoruz
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("user");

    
    const augmentedPosts = await Promise.all(posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post: post._id });
        const commentsCount = await Comment.countDocuments({ post: post._id });
        
        let isLiked = false;
        if (req.user) {
            const like = await Like.findOne({ post: post._id, user: req.user._id });
            isLiked = !!like;
        }
        
        const postObj = post.toObject();
        postObj.likesCount = likesCount;
        postObj.commentsCount = commentsCount;
        postObj.isLiked = isLiked;
        return postObj;
    }));

    res.status(200).json({ status: "succses", data: augmentedPosts });
});

// Belirli bir gönderiyi detayları ve paylaşan kullanıcı bilgileriyle getiriyoruz
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate("user");
    if (!post) {
        return res.status(404).json({ status: "fail", message: "Post not found" });
    }
    
    const likesCount = await Like.countDocuments({ post: post._id });
    const commentsCount = await Comment.countDocuments({ post: post._id });
    
    let isLiked = false;
    if (req.user) {
        const like = await Like.findOne({ post: post._id, user: req.user._id });
        isLiked = !!like;
    }
    
    const postObj = post.toObject();
    postObj.likesCount = likesCount;
    postObj.commentsCount = commentsCount;
    postObj.isLiked = isLiked;

    res.status(200).json({ status: "succses", data: postObj });
});

exports.updatePost = factory.updateOne(Post);

exports.deletePost = factory.deleteOne(Post);