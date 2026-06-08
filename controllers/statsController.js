const User = require("../models/userModel");
const Post = require("../models/postModel");
const Project = require("../models/projectModel");
const Note = require("../models/noteModel");

exports.getStats = async (req, res, next) => {
    try {
        const usersCount = await User.countDocuments();
        const postsCount = await Post.countDocuments();
        const projectsCount = await Project.countDocuments();
        const docsCount = await Note.countDocuments();

        res.status(200).json({
            data: {
                students: usersCount,
                posts: postsCount,
                projects: projectsCount,
                docs: docsCount
            }
        });
    } catch (err) {
        next(err);
    }
};
