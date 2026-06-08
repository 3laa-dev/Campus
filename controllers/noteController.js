const Note = require("../models/noteModel");
const factory = require("./handlersFactory");


const asyncHandler = require("express-async-handler");


exports.createNote = factory.createOne(Note);

// Tüm notları paylaşan kullanıcı bilgileriyle (user) doldurarak getiriyoruz
exports.getAllNotes = asyncHandler(async (req, res, next) => {
    const notes = await Note.find().populate("user");
    res.status(200).json({ status: "succses", data: notes });
});

// Belirli bir notu paylaşan kullanıcı bilgileriyle (user) doldurarak getiriyoruz
exports.getNote = asyncHandler(async (req, res, next) => {
    const note = await Note.findById(req.params.id).populate("user");
    res.status(200).json({ status: "succses", data: note });
});

exports.updateNote = factory.updateOne(Note);

exports.deleteNote = factory.deleteOne(Note);
