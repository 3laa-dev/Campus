const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({

    user: {
        required: true,
        type: mongoose.Schema.ObjectId
    }, 
    course: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    classNum: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        default: 0
    },
    file: {
        type: String,
        required: true
    },
    ratesQuantity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("note", noteSchema);