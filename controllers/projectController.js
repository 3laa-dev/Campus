const Project = require("../models/projectModel");
const factory = require("./handlersFactory");


const asyncHandler = require("express-async-handler");


exports.createProject = factory.createOne(Project);

// Tüm projeleri paylaşan kullanıcı bilgileriyle (user) doldurarak getiriyoruz
exports.getAllProjects = asyncHandler(async (req, res, next) => {
    const projects = await Project.find().populate("user");
    res.status(200).json({ status: "succses", data: projects });
});

// Belirli bir projeyi detayları ve paylaşan kullanıcı bilgileriyle (user) doldurarak getiriyoruz
exports.getProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id).populate("user");
    res.status(200).json({ status: "succses", data: project });
});

exports.updateProject = factory.updateOne(Project);

exports.deleteProject = factory.deleteOne(Project);

