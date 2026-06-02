const router = require("express").Router();
const controller = require("../controllers/noteController");
const auth = require("../controllers/authController");

const multer = require("multer");
const guid = require("guid");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.mimetype.split("/")[0];

    if (type === "application")
      cb(null, "uploads/files");
    else
      cb(new Error("Only files are allowed"), null);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, guid.create().value + ext);
  },
});

const up = multer({ storage: diskStorage });

router
  .route("/")
  .post(
    auth.protect,
    auth.allowedTo("student"),
    up.single("file"),
    (req, res, next) => {
      req.body.file = req.file.filename;
      req.body.user = req.user._id;
      next();
    },
    controller.createNote
  )
  .get(
    auth.protect,
    auth.allowedTo("student"),
    controller.getAllNotes
  );

router
  .route("/:id")
  .get(
    auth.protect,
    auth.allowedTo("student"),
    controller.getNote
  )
  .put(
    auth.protect,
    auth.allowedTo("student"),
    controller.updateNote
  )
  .delete(
    auth.protect,
    auth.allowedTo("student", "admin"),
    controller.deleteNote
  );

module.exports = router;