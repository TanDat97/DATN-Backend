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
        type: Number,
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
    fullname: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    statusProject:{
        type: Number,
        required: true,
    },
    createTime: {
        type: Number,
        required: false,
    },
    updateTime: {
        type: Number,
        required: false,
    },
    allowComment : {
        type: Boolean,
        required: true,
    },
    url : [{
        type: String,
        required: true
    }],
    publicId : [{
        type: String,
        required: true
    }]
    
});

// Export the model
module.exports = mongoose.model('Project', projectSchema);
