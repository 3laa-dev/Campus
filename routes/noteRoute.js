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
      if (!req.file) {
        return res.status(400).json({ message: "PDF dosyası gerekli" });
      }
      req.body.file = req.file.filename;
      req.body.user = req.user._id;
      req.body.fileSizeMb = (req.file.size / (1024 * 1024)).toFixed(2);
      
      try {
          const fs = require('fs');
          const buffer = fs.readFileSync(req.file.path);
          const content = buffer.toString('utf8');
          const matches = content.match(/\/Type[\s]*\/Page[^s]/g);
          req.body.pages = matches ? matches.length : 1;
      } catch (err) {
          req.body.pages = 1;
      }

      const parsedClass = parseInt(req.body.classNum, 10);
      req.body.classNum = Number.isFinite(parsedClass) && parsedClass > 0
          ? parsedClass
          : 1;
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

router.post("/:id/download", auth.protect, auth.allowedTo("student"), controller.incrementDownloads);

module.exports = router;