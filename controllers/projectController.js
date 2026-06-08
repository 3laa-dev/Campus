const Project = require("../models/projectModel");
const factory = require("./handlersFactory");


const asyncHandler = require("express-async-handler");


exports.createProject = factory.createOne(Project);

// Tüm projeleri paylaşan kullanıcı bilgileriyle (user) doldurarak getiriyoruz
exports.getAllProjects = asyncHandler(async (req, res, next) => {
    const projects = await Project.find().populate("user");
    
    // Her projeyi güncel kullanıcının yıldızlayıp yıldızlamadığına göre işaretle
    const augmentedProjects = projects.map(project => {
        const projectObj = project.toObject();
        projectObj.isStarred = req.user ? project.starredBy.some(id => id.toString() === req.user._id.toString()) : false;
        return projectObj;
    });

    res.status(200).json({ status: "succses", data: augmentedProjects });
});

// Belirli bir projeyi detayları ve paylaşan kullanıcı bilgileriyle (user) doldurarak getiriyoruz
exports.getProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id).populate("user");
    if (!project) {
        return res.status(404).json({ status: "fail", message: "Project not found" });
    }
    const projectObj = project.toObject();
    projectObj.isStarred = req.user ? project.starredBy.some(id => id.toString() === req.user._id.toString()) : false;
    res.status(200).json({ status: "succses", data: projectObj });
});

exports.updateProject = factory.updateOne(Project);

exports.deleteProject = factory.deleteOne(Project);

// Projeyi yıldızla veya yıldızı kaldır
exports.toggleStar = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json({ status: "fail", message: "Project not found" });
    }

    const userId = req.user._id;
    const isStarred = project.starredBy.some(id => id.toString() === userId.toString());

    if (isStarred) {
        project.starredBy.pull(userId);
        project.stars = Math.max(0, project.stars - 1);
    } else {
        project.starredBy.addToSet(userId);
        project.stars += 1;
    }

    await project.save();
    res.status(200).json({ 
        status: "succses", 
        data: { 
            stars: project.stars, 
            isStarred: !isStarred 
        } 
    });
});

// Görüntülenme sayısını artır
exports.incrementViews = asyncHandler(async (req, res, next) => {
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
    );
    if (!project) {
        return res.status(404).json({ status: "fail", message: "Project not found" });
    }
    res.status(200).json({ status: "succses", data: { views: project.views } });
});

