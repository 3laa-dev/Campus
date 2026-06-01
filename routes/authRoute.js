const router = require("express").Router();
const authController = require("../controllers/authController");


router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/forgotPassword" ,   authController.forgotPassword);
router.post("/verifyResetCode" ,   authController.verifyPassResetCode);
router.post("/resetPassword" ,   authController.resetPassword);
module.exports = router;