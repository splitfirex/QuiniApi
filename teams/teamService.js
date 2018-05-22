var mongoose = require('mongoose');
var local = require("./");

exports.findAllTeamsOrdered = function (username) {
    return local.team.find({}, null, { sort: { id: -1 } }).exec();
};