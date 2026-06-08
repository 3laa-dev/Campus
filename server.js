const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Yükleme dizinlerinin otomatik oluşturulması
["uploads/images", "uploads/files"].forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const postRoute = require("./routes/postRoute");
const noteRoute = require("./routes/noteRoute");
const projectRoute = require("./routes/projectRoute");
const authRoute = require("./routes/authRoute");
const conversationRoute = require("./routes/conversationRoute");
const userRoute = require("./routes/userRoute");
const likeRoute = require("./routes/likeRoute");
const commentRoute = require("./routes/commetRoute");
const messagesRoute = require("./routes/messagesRoute");
const searchRoute = require("./routes/searchRoute");
const statsRoute = require("./routes/statsRoute");

const User = require("./models/userModel");
const Message = require("./models/messageModel");
const Conversation = require("./models/conversationModel");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.use("/posts", postRoute);
app.use("/notes", noteRoute);
app.use("/projects", projectRoute);
app.use("/auth", authRoute);
app.use("/conversations", conversationRoute);
app.use("/users", userRoute);
app.use("/like", likeRoute);
app.use("/comment" ,commentRoute);
app.use("/messages",messagesRoute);
app.use("/search", searchRoute);
app.use("/stats", statsRoute);

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message,
    statusCode: error.statusCode,
    data: null,
  });
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB error:", err.message);
  });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    console.log("SOCKET TOKEN:", token);

    if (!token) return next(new Error("Not authenticated"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) return next(new Error("User not found"));

    socket.user = user;

    next();
  } catch (err) {
    console.log("SOCKET AUTH ERROR:", err.message);
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.user.email);

  socket.on("join_conversation", (conversationId) => {
    console.log("JOIN ROOM:", conversationId);
    socket.join(conversationId);
  });

  socket.on("send_message", async (data) => {
    try {
      console.log("SEND MESSAGE EVENT:", data);

      const { conversationId, text } = data;

      const message = await Message.create({
        conversationId,
        sender: socket.user._id,
        text,
      });

      console.log("MESSAGE SAVED");

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
      });

      io.to(conversationId).emit("receive_message", message);
    } catch (err) {
      console.log("SEND MESSAGE ERROR:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED:", socket.user.email);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server running on port:", process.env.PORT);
});