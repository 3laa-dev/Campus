const factory = require("./handlersFactory");
const Like = require("../models/likeModel")

exports.addLike = factory.createOne(Like);