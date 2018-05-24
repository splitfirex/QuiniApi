const local = require("./");
var sha1 = require('sha1');

exports.getAllLeaders = function () {
    return local.leaderboard.find({}, null, { sort: { name: -1 } }).exec();
};

exports.getPublicLeader = function (leadername) {
    return local.leaderboard.findOne({ name: leadername, password: { $exists: false } }, { password: 0 }, { sort: { name: -1 } }).exec();
};

exports.getLoggedLeader = function (leadername, username) {
    return local.leaderboard.findOne({ name: leadername, 'listaUsers': { $elemMatch: { username: username, 'isActive': true } } }, { password: 0 }).exec();
};

exports.joinLeader = function (leadername, password, username) {
    return local.leaderboard.findOneAndUpdate({ name: leadername, password: password, 'listaUsers': { $not: { $elemMatch: { username: username } } } }, {
        $push: { listaUsers: new local.leaderboardPlayer({ username: username, isAdmin: false, isActive: false }) }
    }, { new: true }).exec();
}

exports.createLeader = function (leaderData) {
    if(!leaderData.password) delete leaderData.password;
    return local.leaderboard.count({ name: leaderData.name })
        .then((data) => {
            if (data === 0) return new local.leaderboard(leaderData).save();
            return Promise.reject({ errors: { name: "La quiniela ya existe" } });
        });
}

exports.updatePlayerStatus = function (username, leadername, updateData) {
    return local.leaderboard.findOneAndUpdate({ name: leadername, 'listaUsers': { $elemMatch: { username: username, isAdmin: true } } }, {
        $pull: { listaUsers: { username: updateData.username } },
    }, { new: true }).then((leader) => {
        if (leader) return local.leaderboard.findOneAndUpdate({ name: leadername, 'listaUsers': { $elemMatch: { username: username, isAdmin: true } } }, {
            $push: { listaUsers: new local.leaderboardPlayer(updateData) },
        }, { new: true }).exec();
        return Promise.reject({ errors: { name: "La quiniela no existe o no tienes privilegios suficientes" } });
    }
    )
}
