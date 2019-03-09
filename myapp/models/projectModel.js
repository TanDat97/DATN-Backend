var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    investor: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
});

// Export the model
module.exports = mongoose.model('Project', projectSchema);
