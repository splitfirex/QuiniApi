const local = require("./");
const mongoose = require('mongoose');
const leadModule = require("leaderboard");
const userModule = require("users");
var ObjectId = require('mongoose').Types.ObjectId;

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
    var dotUpdatePW = "listaUsers." + username + ".winnerTeam";
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
                if (!group) return Promise.reject({ errors: { name: "La quiniela no existe o no es publica y no perteneces a ella" } });
                if (group.name == "Final") {
                    leadModule.leaderboard.findOneAndUpdate({ name: leadername },
                        { $set: { [dotUpdatePW]: winner } }).exec();
                }
                return group;
            });
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
    var dotUpdateFN = "matches." + matchData.match + ".finished";
    var dotUpdateEE = "matches." + matchData.match + ".editable";

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
                    }, { [dotUpdatePP]: null, [dotUpdateFN]: false }, { multi: true }).exec();

                    Promise.all([query1]).then(() => {
                        local.service.updatePoints();
                    });

                } else {

                    var query1 = local.group.update({
                        [dotUpdateHT]: matchData.home_team,
                        [dotUpdateAT]: matchData.away_team,
                        $or: [{ [dotUpdateHR]: { $ne: matchData.home_result } }, { [dotUpdateAR]: { $ne: matchData.away_result } }],
                        [dotUpdateWI]: winner,
                        [queryDotMatch]: { $exists: true },
                        idLeaderboard: { $exists: true },
                        idUser: { $exists: true }
                    }, { [dotUpdatePP]: 1, [dotUpdateFN]: true }, { multi: true }, function (err, res) {
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
                    }, { [dotUpdatePP]: 3, [dotUpdateFN]: true }, { multi: true }, function (err, res) {
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
                    }, { [dotUpdatePP]: 6, [dotUpdateFN]: true }, { multi: true }, function (err, res) {
                        console.log(res.nModified + "(6 puntos)")
                    });

                    var query4 = local.group.update({
                        [dotUpdateWI]: { $ne: winner },
                        [queryDotMatch]: { $exists: true },
                        idLeaderboard: { $exists: true },
                        idUser: { $exists: true }
                    }, { [dotUpdatePP]: 0, [dotUpdateFN]: true }, { multi: true }, function (err, res) {
                        console.log(res.nModified + "(0 puntos)")
                    });

                    Promise.all([query1, query2, query3, query4]).then(() => {
                        local.service.updatePoints();
                    });

                }
                return group;
            });
    });
};


exports.updatePoints = function () {
    return local.group.aggregate([
        {
            $group: {
                _id: {
                    user: '$idUser',
                    leader: '$idLeaderboard'
                },
                mat: { $addToSet: { $objectToArray: "$matches" } }
            },

        }, {
            $project: {
                "premat": {
                    $reduce: {
                        input: "$mat",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this"] }
                    }
                }
            }
        }, {
            $project: {
                "premat2": { $sum: "$premat.v.playerPoint" }
            }
        }

    ], function (err, res) {
        res.forEach((item) => {
            userModule.user.findById(item._id.user)
                .then((user) => {
                    if (user) {
                        var querydot = "listaUsers." + user.username;
                        var updateDot = "listaUsers." + user.username + ".points";

                        leadModule.leaderboard.findOneAndUpdate({ _id: new ObjectId(item._id.leader), [querydot]: { $exists: true } }, {
                            $set: { [updateDot]: item.premat2 }
                        }, { new: true }).exec();
                    }
                });
        });

    });
}


exports.getDefaultGroups = function () {
    return local.group.find({ idLeaderboard: { $exists: false }, idUser: { $exists: false } }, null, { sort: { order: -1 } }).exec();
};

exports.createDefaulsGroupsPlayer = function (leaderid, idusername, type) {
    var dgroups = local.service.getDefaultGroups();
    return Promise.all([dgroups]).then(([dgroupsR]) => {
        dgroupsR.forEach(element => {
            element._id = mongoose.Types.ObjectId();
            element.isNew = true;
            element.idLeaderboard = leaderid;
            element.idUser = idusername;
            if (element.type != "group" && type == "Por Fases") {
                Object.keys(element.matches).forEach((key) => element.matches[key].forced = true);
            }

            element.save();
        });
    });
};

exports.lockEdit = function () {
    var now = new Date();
    var dateOffset = (24 * 60 * 60 * 1000) * 1;
    var tomorrow = now.getTime() + dateOffset;
    console.log("Actualizando matches" + tomorrow);
    return local.group.aggregate([
        {
            $match: {
                'idUser': { $exists: false }
            }
        }, {
            $group: {
                _id: {
                    user: "$idUser"
                },
                matches: { $addToSet: { $objectToArray: "$matches" } }
            },

        }, {
            $project: {
                "matches": {
                    $reduce: {
                        input: "$matches",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this.v"] }
                    }
                }
            }
        }, {
            $project: {
                matches: {
                    $filter: {
                        input: "$matches",
                        as: "item",
                        cond: {
                            $and: [
                                { $lte: ["$$item.date", tomorrow] },
                                { $eq: ["$$item.editable", true] }
                            ]
                        }
                    }
                }
            }
        }

    ], function (err, res) {
        res.forEach((item) => {
            item.matches.forEach((match) => {
                var queryDotMatch = "matches." + match.name
                var queryDotMatchEditable = "matches." + match.name +".editable"
                local.group.update({
                    [queryDotMatch]: { $exists: true },
                    [queryDotMatchEditable]: true
                }, { [queryDotMatchEditable]: false }, { multi: true }, function (err, res) {
                    console.log(res.nModified + "(editables)")
                });
            });
        });
        return res;
    });

}

exports.deleteGroupsPlayer = function (leaderid, username) {
    return userModule.user.findOne({ username: username }).then((user) =>
        !user ? Promise.reject({ errors: { name: "La quiniela no existe o no perteneces a ella" } }) :
            local.group.remove({ idLeaderboard: leaderid, idUser: user._id })
    );

};