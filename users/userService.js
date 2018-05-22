var mongoose = require('mongoose');
var local = require("./");

exports.findByUsername = function(username){
    return local.user.findOne({username: username}).select("_id username password").exec();
};

exports.findById = function(id){
    return local.user.findById(id).select("_id username").exec();
};
