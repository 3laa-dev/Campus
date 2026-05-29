const router = require("express").Router();
const controller = require("../controllers/usersConterller");
const auth = require("../controllers/authController");



router
    .route("/")
    .get(auth.protect, auth.allowedTo("admin"), controller.getAllUsers);

router
    .route("/:id")
    .get(auth.protect, auth.allowedTo("admin"), controller.getUser)
    .put(auth.protect, auth.allowedTo("admin"), (req, res, next) => {
        if (req.body.password)
            return next(new Error("You cant change password"))
        next();
    }, controller.updateUser)
    .delete(auth.protect, auth.allowedTo("admin"), controller.deleteUser);

module.exports = router;