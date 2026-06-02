const router = require("express").Router();
const controller = require("../controllers/projectController");
const auth = require("../controllers/authController");


router.route("/")
    .post(auth.protect , auth.allowedTo("student"),  
        (req, res, next) => {
            req.body.image = req.file.filename;
            req.body.user = req.user._id
            next()
        },
        controller.createProject)
    .get(auth.protect , auth.allowedTo("student") , controller.getAllProjects);

router.route("/:id")
    .get( auth.protect , auth.allowedTo("student") , controller.getProject)
    .put(  auth.protect , auth.allowedTo("student") , controller.updateProject)
    .delete( auth.protect , auth.allowedTo("student" , "admin") , controller.deleteProject);

module.exports = router;