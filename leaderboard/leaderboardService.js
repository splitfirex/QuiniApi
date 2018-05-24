const local = require("./");
var sha1 = require('sha1');

exports.getAllLeaders = function () {
    return local.leaderboard.find({}, null, { sort: { name: -1 } }).exec();
};

exports.getPublicLeader = function (leadername) {
    return local.leaderboard.findOne({ name: leadername, password: { $exists: false } }, { password: 0 }, { sort: { name: -1 } }).exec();
};

exports.getLoggedLeader = function (leadername, username) {
    var dotQuery = "listaUsers." + username + ".isActive";
    return local.leaderboard.findOne({ name: leadername, [dotQuery]: true }, { password: 0 }).exec();
};

exports.joinLeader = function (leadername, password, username) {
    var dotUpdate = "listaUsers." + username;
    return local.leaderboard.findOneAndUpdate({ name: leadername, password: password, [dotUpdate]: { $exists: false } }, {
        $set: { [dotUpdate]: new local.leaderboardPlayer({ username: username, isAdmin: false, isActive: false }) }
    }, { new: true });
}

exports.createLeader = function (leaderData) {
    if (!leaderData.password) delete leaderData.password;
    return local.leaderboard.count({ name: leaderData.name })
        .then((data) => {
            if (data === 0) return new local.leaderboard(leaderData).save();
            return Promise.reject({ errors: { name: "La quiniela ya existe" } });
        });
}

exports.updatePlayerStatus = function (username, leadername, updateData) {
    var dotUpdateActive = "listaUsers." + updateData.username + ".isActive";
    var dotUpdateAdmin = "listaUsers." + updateData.username + ".isAdmin";
    var dotQuery = "listaUsers." + username + ".isAdmin";
    return local.leaderboard.findOneAndUpdate({ name: leadername, [dotQuery]: true }, {
        $set: { [dotUpdateActive]: updateData.isActive, [dotUpdateAdmin]: updateData.isAdmin },
    }, { new: true })
        .then((leader) => !leader ? Promise.reject({ errors: { name: "La quiniela no existe o no tienes privilegios suficientes" } }) : leader);
}
