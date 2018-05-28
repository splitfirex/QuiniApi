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
    var leader = leadModule.leaderboard.findOne({ name: leadername, password: { $exists: false } }).exec();
    var user = userModule.user.findOne({ username: username }).exec();
    return Promise.all([leader, user]).then(([leaderR, userR]) => {
        if (!leaderR || !userR) return Promise.reject({ errors: { name: "La quiniela no existe o no es publica" } });
        return local.group.find({ idLeaderboard: leaderR._id, idUser: userR._id }, null, { sort: { order: 1 } }).exec();
    });
};

exports.getLoggedMatches = function (leadername, username, loggedusername) {
    var queryDot = "listaUsers." + loggedusername + ".isActive";
    var leader = leadModule.leaderboard.findOne({ name: leadername, $or: [{ [queryDot]: true }, { password: { $exists: false } }] }).exec();
    var user = userModule.user.findOne({ username: username }).exec();
    return Promise.all([leader, user]).then(([leaderR, userR]) => {
        if (!leaderR || !userR) return Promise.reject({ errors: { name: "La quiniela no existe o no es publica y no perteneces a ella" } });
        return local.group.find({ idLeaderboard: leaderR._id, idUser: userR._id }, null, { sort: { order: 1 } }).exec();
    });
};

exports.updateMatch = function (leadername, username, matchData) {
    var queryDot = "listaUsers." + username + ".isActive";
    var queryDotMatch = "matches." + matchData.match;
    var dotUpdateHR = "matches." + matchData.match + ".home_result";
    var dotUpdateAR = "matches." + matchData.match + ".away_result";
    var dotUpdateHP = "matches." + matchData.match + ".home_penalty";
    var dotUpdateAP = "matches." + matchData.match + ".away_penalty";
    var dotUpdateHT = "matches." + matchData.match + ".home_team";
    var dotUpdateAT = "matches." + matchData.match + ".away_team";
    var dotUpdateWI = "matches." + matchData.match + ".winner";
    var leader = leadModule.leaderboard.findOne({ name: leadername, [queryDot]: true }).exec();
    var user = userModule.user.findOne({ username: username }).exec();

    var winner = null;
    if (!isNaN(matchData.home_result) && !isNaN(matchData.away_result)) {
        if (matchData.home_result == matchData.away_result) {
            if (isNaN(matchData.away_penalty) == isNaN(matchData.home_penalty)) {
                winner = -1;
            } else {
                winner = matchData.home_penalty > matchData.away_penalty ? matchData.home_team : matchData.away_team;
            }
        } else {
            winner = matchData.home_result > matchData.away_result ? matchData.home_team : matchData.away_team;
        }
    }

    return Promise.all([leader, user]).then(([leaderR, userR]) => {
        if (!leaderR || !userR) return Promise.reject({ errors: { name: "La quiniela no existe o no es publica y no perteneces a ella" } });
        return local.group.findOneAndUpdate({ idLeaderboard: leaderR._id, idUser: userR._id, [queryDotMatch]: { $exists: true } }, {
            $set: {
                [dotUpdateHR]: matchData.home_result, [dotUpdateAR]: matchData.away_result,
                [dotUpdateHP]: matchData.home_penalty, [dotUpdateAP]: matchData.away_penalty,
                [dotUpdateHT]: matchData.home_team, [dotUpdateAT]: matchData.away_team,
                [dotUpdateWI]: winner
            }
        }, { new: true })
            .then((group) =>
                !group ? Promise.reject({ errors: { name: "La quiniela no existe o no es publica y no perteneces a ella" } }) : group);
    });
};


exports.updateMatchMain = function (leadername, username, matchData) {
    var queryDot = "listaUsers." + username + ".isActive";
    var queryDotMatch = "matches." + matchData.match;
    var dotUpdateHR = "matches." + matchData.match + ".home_result";
    var dotUpdateAR = "matches." + matchData.match + ".away_result";
    var dotUpdateHP = "matches." + matchData.match + ".home_penalty";
    var dotUpdateAP = "matches." + matchData.match + ".away_penalty";
    var dotUpdateHT = "matches." + matchData.match + ".home_team";
    var dotUpdateAT = "matches." + matchData.match + ".away_team";
    var dotUpdateWI = "matches." + matchData.match + ".winner";
    var dotUpdatePP = "matches." + matchData.match + ".playerPoint";

    var leader = leadModule.leaderboard.findOne({ name: leadername, [queryDot]: true }).exec();
    var user = userModule.user.findOne({ username: username }).exec();

    var winner = null;
    if (!isNaN(matchData.home_result) && !isNaN(matchData.away_result)) {
        if (matchData.home_result == matchData.away_result) {
            if (isNaN(matchData.away_penalty) == isNaN(matchData.home_penalty)) {
                winner = -1;
            } else {
                winner = matchData.home_penalty > matchData.away_penalty ? matchData.home_team : matchData.away_team;
            }
        } else {
            winner = matchData.home_result > matchData.away_result ? matchData.home_team : matchData.away_team;
        }
    }

    return Promise.all([leader, user]).then(([leaderR, userR]) => {
        if (!leaderR || !userR) return Promise.reject({ errors: { name: "La quiniela no existe o no es publica y no perteneces a ella" } });
        return local.group.findOneAndUpdate({ idLeaderboard: leaderR._id, idUser: userR._id, [queryDotMatch]: { $exists: true } }, {
            $set: {
                [dotUpdateHR]: matchData.home_result, [dotUpdateAR]: matchData.away_result,
                [dotUpdateHP]: matchData.home_penalty, [dotUpdateAP]: matchData.away_penalty,
                [dotUpdateHT]: matchData.home_team, [dotUpdateAT]: matchData.away_team,
                [dotUpdateWI]: winner
            }
        }, { new: true })
            .then((group) => {

                if (isNaN(matchData.home_result) || isNaN(matchData.away_result)) {
                    var query1 = local.group.update({
                        [queryDotMatch]: { $exists: true },
                        idLeaderboard: { $exists: true },
                        idUser: { $exists: true }
                    }, { [dotUpdatePP]: null }, { multi: true }).exec();

                } else {

                    var query1 = local.group.update({
                        [dotUpdateHT]: matchData.home_team,
                        [dotUpdateAT]: matchData.away_team,
                        $or: [{ [dotUpdateHR]: { $ne: matchData.home_result } }, { [dotUpdateAR]: { $ne: matchData.away_result } }],
                        [dotUpdateWI]: winner,
                        [queryDotMatch]: { $exists: true },
                        idLeaderboard: { $exists: true },
                        idUser: { $exists: true }
                    }, { [dotUpdatePP]: 1 }, { multi: true }, function (err, res) {
                        console.log(res.nModified + "(1 puntos)")
                    });

                    var query2 = local.group.update({
                        [dotUpdateHT]: matchData.home_team,
                        [dotUpdateAT]: matchData.away_team,
                        [dotUpdateHR]: matchData.home_result,
                        [dotUpdateAR]: matchData.away_result,
                        [dotUpdateWI]: winner,
                        [queryDotMatch]: { $exists: true },
                        idLeaderboard: { $exists: true },
                        idUser: { $exists: true }
                    }, { [dotUpdatePP]: 3 }, { multi: true }, function (err, res) {
                        console.log(res.nModified + "(3 puntos)")
                    });

                    var query3 = local.group.update({
                        [dotUpdateHT]: matchData.home_team,
                        [dotUpdateAT]: matchData.away_team,
                        [dotUpdateHP]: matchData.home_penalty,
                        [dotUpdateAP]: matchData.away_penalty,
                        [dotUpdateHP]: { $ne: NaN },
                        [dotUpdateAP]: { $ne: NaN },
                        [dotUpdateWI]: winner,
                        [queryDotMatch]: { $exists: true },
                        idLeaderboard: { $exists: true },
                        idUser: { $exists: true }
                    }, { [dotUpdatePP]: 6 }, { multi: true }, function (err, res) {
                        console.log(res.nModified + "(6 puntos)")
                    });

                    var query4 = local.group.update({
                        [dotUpdateWI]: { $ne: winner },
                        [queryDotMatch]: { $exists: true },
                        idLeaderboard: { $exists: true },
                        idUser: { $exists: true }
                    }, { [dotUpdatePP]: 0 }, { multi: true }, function (err, res) {
                        console.log(res.nModified + "(0 puntos)")
                    });

                }
                return group;
            });
    });
};

exports.getDefaultGroups = function () {
    return local.group.find({ idLeaderboard: { $exists: false }, idUser: { $exists: false } }, null, { sort: { order: -1 } }).exec();
};

exports.createDefaulsGroupsPlayer = function (leaderid, username) {
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

exports.deleteGroupsPlayer = function (leaderid, username) {
    return userModule.user.findOne({ username: username }).then((user) =>
        !user ? Promise.reject({ errors: { name: "La quiniela no existe o no perteneces a ella" } }) :
            local.group.remove({ idLeaderboard: leaderid, idUser: user._id })
    );

};