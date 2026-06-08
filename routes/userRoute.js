const router = require("express").Router();
const controller = require("../controllers/usersConterller");
const auth = require("../controllers/authController");
const multer = require("multer");
const guid = require("guid");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = file.mimetype.split("/")[0];
        if (type === "image")
            cb(null, path.join(__dirname, "../uploads/images"));
        else
            cb(new Error("Only images are allowed"), null);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, guid.create().value + ext);
    },
});

const up = multer({ storage: diskStorage });

router.get("/me", auth.protect, controller.getMe);
router.put("/updateMe", auth.protect, up.single("profileImage"), (req, res, next) => {
    if (req.file) {
        req.body.profileImage = req.file.filename;
    }
    next();
}, controller.updateMe);

router
    .route("/")
    .get(auth.protect, auth.allowedTo("admin"), controller.getAllUsers);

router
    .route("/:id")
    .get(auth.protect, controller.getUser)
    .put(auth.protect, auth.allowedTo("admin"), (req, res, next) => {
        if (req.body.password)
            return next(new Error("You cant change password"))
        next();
    }, controller.updateUser)
    .delete(auth.protect, auth.allowedTo("admin"), controller.deleteUser);

module.exports = router;