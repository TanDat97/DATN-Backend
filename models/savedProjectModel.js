var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: false,
    },
    projectid: {
        type: String,
        required: true,
    },
    projectName: {
        type: String,
        required: false,
    },
    createTime: {
        type: Number,
        required: true,
    },
});

// Export the model
module.exports = mongoose.model('SavedProject', projectSchema);
