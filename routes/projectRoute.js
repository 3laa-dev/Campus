const router = require("express").Router();
const controller = require("../controllers/projectController");
const auth = require("../controllers/authController");


router.route("/")
    .post(auth.protect , auth.allowedTo("student"),  
        (req, res, next) => {
            req.body.user = req.user._id
            next()
        },
        controller.createProject)
    .get(auth.protect , auth.allowedTo("student") , controller.getAllProjects);

router.route("/:id")
    .get( auth.protect , auth.allowedTo("student") , controller.getProject)
    .put(  auth.protect , auth.allowedTo("student") , controller.updateProject)
    .delete( auth.protect , auth.allowedTo("student" , "admin") , controller.deleteProject);

router.post("/:id/star", auth.protect, auth.allowedTo("student"), controller.toggleStar);
router.post("/:id/view", auth.protect, auth.allowedTo("student"), controller.incrementViews);

module.exports = router;