const Project = require("../models/projectModel");
const factory = require("./handlersFactory");


exports.createProject = factory.createOne(Project);

exports.getAllProjects =  factory.getAll(Project);

exports.getProject = factory.getOne(Project);

exports.updateProject = factory.updateOne(Project);

exports.deleteProject = factory.deleteOne(Project);

