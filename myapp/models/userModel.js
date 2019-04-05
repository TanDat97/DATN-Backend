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
        trim: true, unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
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
        required: false,
    }
});
// Schema.set('toJSON', {getters: true, virtuals: true});
// Schema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
//     var that = this;
//     return this.findOne({
//         'googleProvider.id': profile.id
//     }, function(err, user) {
//         // no user was found, lets create a new one
//         if (!user) {
//             var newUser = new that({
//                 fullName: profile.displayName,
//                 email: profile.emails[0].value,
//                 phone: profile.phone[0].value,
//                 googleProvider: {
//                     id: profile.id,
//                     token: accessToken
//                 }
//             });

//             newUser.save(function(error, savedUser) {
//                 if (error) {
//                     console.log(error);
//                 }
//                 return cb(error, savedUser);
//             });
//         } else {
//             return cb(err, user);
//         }
//     });
// };

// Export the model
module.exports = mongoose.model('User', Schema);