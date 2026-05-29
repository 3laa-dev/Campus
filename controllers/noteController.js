const Note = require("../models/noteModel");
const factory = require("./handlersFactory");


exports.createNote = factory.createOne(Note);

exports.getAllNotes =  factory.getAll(Note);

exports.getNote = factory.getOne(Note);

exports.updateNote = factory.updateOne(Note);

exports.deleteNote = factory.deleteOne(Note);
