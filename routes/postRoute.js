const router = require("express").Router();
const controller = require("../controllers/postController");
const multer = require("multer");
const guid = require("guid");
const path = require("path");
const auth = require("../controllers/authController");

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = file.mimetype.split("/")[0]
        if (type === "image")
            cb(null, "uploads/images");
        else
            cb(new Error("Only images are allowed"), null);
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);

        cb(null, guid.create().value + ext);
    },
});

const up = multer({ storage: diskStorage });

const {
    createPostValidator,
    getPostValidator,
    updatePostValidator,
    deletePostValidator,
} = require("../utils/validators/postValidator");

router
    .route("/")
    .post(auth.protect , auth.allowedTo("student"), up.single("image"), createPostValidator,
        (req, res, next) => {
            req.body.image = req.file.filename;
            req.body.user = req.user._id
            next()
        }
        , controller.createPost)
    .get(auth.protect , auth.allowedTo("student") , controller.getAllPosts);

router
    .route("/:id")
    .get(auth.protect , auth.allowedTo("student") , getPostValidator, controller.getPost)
    .put(auth.protect , auth.allowedTo("student"),updatePostValidator, controller.updatePost)
    .delete(auth.protect , auth.allowedTo("student","admin" ) , deletePostValidator, controller.deletePost);

module.exports = router;