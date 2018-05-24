const local = require("./");
const mongoose = require('mongoose');
const leadModule = require("leaderboard");
const userModule = require("users");

exports.createGroup = function (groupData) {
    local.group.find({ idLeaderboard: groupData.idLeaderboard, idUser: groupData.idUser, order: groupData.order }, function (data) {
        if (!data) new local.group(groupData).save();
    }).catch((err) => console.log(err));
};

exports.getPublicMatches = function (leadername, username) {
    console.log(leadername + username);
    var leader = leadModule.leaderboard.findOne({ name: leadername, password: { $exists: false } }).exec();
    var user = userModule.user.findOne({ username: username }).exec();
    return Promise.all([leader, user]).then(([leaderR, userR]) => {
        console.log(leaderR + userR);
        if (!leaderR || !userR) return Promise.reject({ errors: { name: "La quiniela ya existe" } });
        return local.group.find({ idLeaderboard: leaderR._id, idUser: userR._id }, null, { sort: { order: -1 } }).exec();
    });
};

exports.getDefaultGroups = function () {
    return local.group.find({ idLeaderboard: { $exists: false }, idUser: { $exists: false } }, null, { sort: { order: -1 } }).exec();
};

exports.createDefaulsGroupsPlayer  = function (leaderid, username) {
    var user = userModule.user.findOne({ username: username }).exec();
    var dgroups = local.service.getDefaultGroups();
    return Promise.all([dgroups, user]).then(([dgroupsR, userR]) => {
        dgroupsR.forEach(element => {
            element._id = mongoose.Types.ObjectId();
            element.isNew = true;
            element.idLeaderboard = leaderid;
            element.idUser = userR._id;
            element.save();
        });
    });
};
