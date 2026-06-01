const router = require("express").Router();
const likeController = require("../controllers/likeController");
const auth = require("../controllers/authController");

router
    .route("/")
    .post(auth.protect ,
         auth.allowedTo("student"),
         (req, res, next) => {
            req.body.user = req.user._id
            next()
        },
         likeController.addLike
        );
        
router
    .route("/:id")
    .delete(auth.protect , 
    auth.allowedTo("student"),
    likeController.removeLike
    )
   .get(
    auth.protect , 
    auth.allowedTo("student"),
    likeController.getLikesOnPost
   )
router
.get("/isLiked/:id",auth.protect ,
         auth.allowedTo("student"),
         likeController.isLiked);

module.exports = router