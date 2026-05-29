const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const asyncHandler = require("express-async-handler");


exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { conversationId, text } = req.body;
  const sender = req.user._id;

  const message = await Message.create({
    conversationId,
    sender,
    text,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: text,
  });

  res.status(201).json({
    status: "success",
    data: message,
  });
});


exports.getMessages = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId })
    .populate("sender", "email")
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: "success",
    data: messages,
  });
});