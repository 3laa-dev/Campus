const router = require("express").Router();
const controller = require("../controllers/messageController");
const auth = require("../controllers/authController");

router.get("/:id" , 
    auth.protect , 
    controller.getMessages
)
module.exports = router;