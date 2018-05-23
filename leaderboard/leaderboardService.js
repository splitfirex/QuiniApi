const local = require("./");

exports.getAllLeaders = function () {
    return local.leaderboard.find({}, null, { sort: { name: -1 } }).exec();
};

exports.getPublicLeader = function (leadername) {
    return local.leaderboard.findOne({ name: leadername, password: { $exists: false } }, { password: 0 }, { sort: { name: -1 } }).exec();
};

exports.getLoggedLeader = function (leadername, username) {
    return local.leaderboard.findOne({ name: leadername, 'listaUsers.username': username, 'listaUsers.isActive': true }, { password: 0 }).exec();
};

exports.joinLeader = function (leadername, username) {
    return local.leaderboard.findOneAndUpdate({ name: leadername, 'listaUsers.username': { "$ne": username } }, {
        $push: { listaUsers: new local.leaderboardPlayer({ username: username, isAdmin: false, isActive: false }) }
    }).exec();
}

exports.createLeader = function (leaderData) {
    local.leaderboard.find({ name: leaderData.name }, function(data){
        if(!data) new local.leaderboard(leaderData).save();
    }).catch((err)=> console.log(err));
}
