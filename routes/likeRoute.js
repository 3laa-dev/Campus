const router = require("express").Router();
const likeController = require("../controllers/likeController");
const auth = require("../controllers/authController");

router
    .route("/:id")
    .post(auth.protect ,
         auth.allowedTo("student"),
         (req, res, next) => {
            req.body.user = req.user._id
            next()
        },
         likeController.addLike
        );