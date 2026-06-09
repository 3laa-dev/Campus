const Conversation = require("../models/conversationModel");
const asyncHandler = require("express-async-handler");

exports.createConversation = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  conversation = await conversation.populate("participants", "name email profileImage username");

  res.status(200).json({
    status: "success",
    data: conversation,
  });
});
exports.getAllConversation = asyncHandler(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  }).populate("participants", "name email profileImage username");

  res.status(200).json({
    status: "success",
    data: conversations,
  });
});