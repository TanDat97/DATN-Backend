var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    project: {
        type: String,
        ref: 'Project',
        required: true,
    },
    createdTransaction: {
        type: Boolean,
        required: true,
    },
    choosenone: {
        type: String,
        default: '0',
    },
    requests: [{
        user: {
            type: String,
            ref: 'User',
            required: true,
        },
        createTime: {
            type: Number,
            required: true,
        },
        money: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: 'info',
        },
    }]
});

// Export the model
module.exports = mongoose.model('Waiting', projectSchema);
