var mongoose = require('mongoose');
var local = require("./");

exports.findByUsername = function (username) {
    return local.user.findOne({ username: username }).select("_id username password").exec();
};

exports.findById = function (id) {
    return local.user.findById(id).select("_id username").exec();
};

exports.registerUser = function (userData) {
    return local.user.count({ username: userData.username }, function (err, val) {
        console.log(val);
        if (val === 0) {
            return new local.user(userData).save();
        }
        return Promise.reject({ errors: { username: "Usuario ya existe" } });
    }).exec();
}