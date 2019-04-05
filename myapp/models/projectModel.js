var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    investor: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: false,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },
    ownerid: {
        type: String,
        required: true,
    },
    statusProject:{
        type: String,
        required: true,
    },
    createTime: {
        type: Number,
        requireed: false,
    },
    updateTime: {
        type: Number,
        requireed: false,
    }
});

// Export the model
module.exports = mongoose.model('Project', projectSchema);
