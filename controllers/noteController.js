const Note = require("../models/noteModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const path = require("path");


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

// İndirme sayısını artır (ratesQuantity)
exports.incrementDownloads = asyncHandler(async (req, res, next) => {
    const note = await Note.findByIdAndUpdate(
        req.params.id,
        { $inc: { ratesQuantity: 1 } },
        { new: true }
    );
    if (!note) {
        return res.status(404).json({ status: "fail", message: "Note not found" });
    }
    res.status(200).json({ status: "succses", data: { downloads: note.ratesQuantity } });
});

// Dosyayı doğrudan indirme olarak sun (Content-Disposition: attachment)
exports.downloadFile = asyncHandler(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (!note || !note.file) {
        return res.status(404).json({ status: "fail", message: "File not found" });
    }
    const filePath = path.join(__dirname, "../uploads/files", note.file);
    const ext = path.extname(note.file) || '.pdf';
    const downloadName = `${note.title.replace(/[^a-zA-Z0-9\s]/g, "")}${ext}`;
    
    res.download(filePath, downloadName);
});
