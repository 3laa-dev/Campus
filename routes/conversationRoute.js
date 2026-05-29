const router = require("express").Router();

const controller = require("../controllers/conversationController");
const { protect } = require("../controllers/authController");

router.post("/", protect, controller.createConversation);
// router.get("/", protect, controller.getMyConversations);
// router.get("/:id", protect, controller.getConversation);

module.exports = router;