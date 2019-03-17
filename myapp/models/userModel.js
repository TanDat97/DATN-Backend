const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phone: {
        type: String,
        required: true
    },
    totalProject: {
        type: Number,
        required: true,
    },
    statusAccount: {
        type: Number,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    }
});

// Export the model
module.exports = mongoose.model('User', Schema);