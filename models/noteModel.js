const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({

    user: {
        required: true,
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }, 
    title: {
        type: String,
        default: ''
    },
    course: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    docType: {
        type: String,
        default: 'Not'
    },
    semester: {
        type: String,
        default: ''
    },
    classNum: {
        type: Number,
        default: 1
    },
    rate: {
        type: Number,
        default: 0
    },
    file: {
        type: String,
        required: true
    },
    fileSizeMb: {
        type: String,
        default: ''
    },
    ratesQuantity: {
        type: Number,
        default: 0
    },
    pages: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("note", noteSchema);