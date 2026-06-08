const User = require("../models/userModel");
const Post = require("../models/postModel");
const Project = require("../models/projectModel");
const Note = require("../models/noteModel");

exports.search = async (req, res, next) => {
    try {
        const { q, type } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query is required", data: [] });
        }

        const regex = new RegExp(q, "i");
        let results = [];

        if (type === "user") {
            const users = await User.find({
                $or: [{ name: regex }, { email: regex }]
            }).select("-password");
            
            results = users.map(u => ({
                id: u._id,
                type: "user",
                title: u.name,
                user: u.username || u.name,
                profileImage: u.profileImage || "",
                tags: u.title ? [u.title] : []
            }));
        } else if (type === "post") {
            const posts = await Post.find({
                $or: [{ title: regex }, { content: regex }]
            }).populate("user", "name");
            
            results = posts.map(p => ({
                id: p._id,
                type: "post",
                title: p.title,
                user: p.user ? p.user.name : "Bilinmeyen",
                tags: p.tags || []
            }));
        } else if (type === "project") {
            const projects = await Project.find({
                $or: [{ title: regex }, { description: regex }]
            }).populate("user", "name");
            
            results = projects.map(p => ({
                id: p._id,
                type: "project",
                title: p.title,
                user: p.user ? p.user.name : "Bilinmeyen",
                tags: []
            }));
        } else if (type === "doc") {
            const notes = await Note.find({
                $or: [{ title: regex }, { course: regex }, { description: regex }]
            }).populate("user", "name");
            
            results = notes.map(n => ({
                id: n._id,
                type: "doc",
                title: n.title || n.course,
                user: n.user ? n.user.name : "Bilinmeyen",
                tags: n.docType ? [n.docType] : []
            }));
        } else {
            return res.status(400).json({ message: "Invalid type parameter", data: [] });
        }

        res.status(200).json({ data: results });
    } catch (err) {
        next(err);
    }
};
