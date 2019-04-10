const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    createTime: {
        type: Number,
        requireed: true,
    },
    updateTime: {
        type: Number,
        requireed: true,
    },
    content: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        required: true
    },
    accountType: {
        type: String,
        required: false,
    }, 
    projectid: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
});

// Export the model
module.exports = mongoose.model('Comment', Schema);