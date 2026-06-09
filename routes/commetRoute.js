const router = require("express").Router();

const commentController = require("../controllers/commentController");
const auth = require("../controllers/authController");


router.post(
  "/:postId",
  auth.protect,
  auth.allowedTo("student"),
  (req, res, next) => {
    req.body = {
      text: req.body.text,
      user: req.user._id,
      post: req.params.postId,
    };
    next();
  },
  commentController.createComment
);

router.get(
    "/:id",
    commentController.getAllCommentsOnPost
)




module.exports = router