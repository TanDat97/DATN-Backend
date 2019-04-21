const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    createTime: {
        type: Number,
        requireed: true,
    },
    updateTime: {
        type: Number,
        requireed: true,
    }
});

// Export the model
module.exports = mongoose.model('News', Schema);