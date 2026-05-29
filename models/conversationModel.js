const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = model("Conversation", conversationSchema);