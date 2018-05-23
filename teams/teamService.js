var mongoose = require('mongoose');
var local = require("./");

exports.findAllTeamsOrdered = function (username) {
    return local.team.find({}, null, { sort: { id: -1 } }).exec();
};

exports.createTeam = function(teamData){
    local.team.find({ id: teamData.id }, function (data) {
        if (!data) new local.team(teamData).save();
    }).catch((err) => console.log(err));
}