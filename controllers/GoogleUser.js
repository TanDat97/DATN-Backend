var gg = require('../models/userModel'),
  UserGG = gg.model('User');

var  mongoose = require('mongoose');

exports.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
    UserGG.findOne({
        'googleProvider.id': profile.id
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new UserGG({
                _id: new mongoose.Types.ObjectId(),
                fullname: profile.displayName,
                address: '',
                phone:'',
                description: '',
                email: profile.emails[0].value,
                googleProvider: {
                    id: profile.id,
                    token: accessToken
                },
                totalProject:0,
                statusAccount:0,
                avatar:profile._json['picture'],
                company: '0',
                lock: false,
            });

            newUser.save(function(error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};