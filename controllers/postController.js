const Post = require("../models/postModel");
const factory = require("./handlersFactory");


exports.createPost = factory.createOne(Post);

exports.getAllPosts =  factory.getAll(Post);

exports.getPost = factory.getOne(Post);

exports.updatePost = factory.updateOne(Post);

exports.deletePost = factory.deleteOne(Post);