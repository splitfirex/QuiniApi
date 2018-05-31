const local = require("./");
var sha1 = require('sha1');
var groupsModel = require('groups');
var userModule = require('users');

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => (res[key] = obj[key], res), {});

exports.getAllLeaders = function () {
    return local.leaderboard.find({}, null, { sort: { name: -1 } }).exec();
};

exports.getPublicLeader = function (leadername) {
    return local.leaderboard.findOne({ name: leadername, password: { $exists: false } }, { password: 0 }, { sort: { name: -1 } }).exec();
};


exports.getLoggedLeader = function (leadername, username) {
    var dotQuery = "listaUsers." + username+".isActive";
    return local.leaderboard.findOne({ name: leadername, $or: [{ [dotQuery]: true }, { password: { $exists: false } }] }, { password: 0 })
        .then((leader) => {
            if (!leader) return Promise.reject({ errors: { name: "La quiniela no existe o no tienes privilegios suficientes" } });
            return leader;
        })
};

exports.updateColor = function (leadername, username) {
    var dotUpdate = "listaUsers." + username;
    return local.leaderboard.findOneAndUpdate({ name: leadername, [dotUpdate]: { $exists: true } }, {
        $set: { bgColor: Math.floor((Math.random() * 256 * 256 * 256)).toString(16) }
    }, { new: true })
        .then((leader) => {
            if (!leader) return Promise.reject({ errors: { name: "La quiniela no existe o no tienes privilegios suficientes" } });
            return leader;
        });
}


exports.joinLeader = function (leadername, password, username) {
    var dotUpdate = "listaUsers." + username;
    var user = userModule.user.findOne({ username: username }).exec();

    return Promise.all([user]).then(([userR]) => {
        return local.leaderboard.findOneAndUpdate({ name: leadername, password: password, [dotUpdate]: { $exists: false } }, {
            $set: { [dotUpdate]: new local.leaderboardPlayer({ id: user._id, username: username, isAdmin: false, isActive: false }) }
        }, { new: true })
            .then((leader) => {
                if (!leader) return Promise.reject({ errors: { name: "La quiniela no existe o no tienes privilegios suficientes" } });
                groupsModel.service.createDefaulsGroupsPlayer(leader._id, userR._id, leader.type);
                return leader;
            });
    });
}

exports.leaveleader = function (leadername, username) {
    var dotUpdate = "listaUsers." + username;
    return local.leaderboard.findOneAndUpdate({ name: leadername, [dotUpdate]: { $exists: true } }, {
        $unset: { [dotUpdate]: "" }
    }, { new: true }).then((leader) => {
        if (!leader) return Promise.reject({ errors: { name: "La quiniela no existe o no tienes privilegios suficientes" } });
        groupsModel.service.deleteGroupsPlayer(leader._id, username);
        return leader;
    }).then((leader) => {
        var hayAdmins = Object.filter(leader.listaUsers, isAdmin => true).length;
        if (!hayAdmins && Object.keys(leader.listaUsers).length > 0) {
            leader.listaUsers[Object.keys(leader.listaUsers)[0]].isActive = true;
            leader.listaUsers[Object.keys(leader.listaUsers)[0]].isAdmin = true;
            return leader.save();
        }
        if (!Object.keys(leader.listaUsers).length) return leader.remove();
        return leader;
    });
}

exports.kickplayer = function (leadername, kickusername, username) {
    var dotQuery = "listaUsers." + username + ".isAdmin";
    var dotUpdate = "listaUsers." + kickusername;
    return local.leaderboard.findOneAndUpdate({ name: leadername, [dotQuery]: true, [dotUpdate]: { $exists: true } }, {
        $unset: { [dotUpdate]: "" }
    }, { new: true }).then((leader) => {
        if (!leader) return Promise.reject({ errors: { name: "La quiniela no existe o no tienes privilegios suficientes" } });
        groupsModel.service.deleteGroupsPlayer(leader._id, username);
        return leader;
    }).then((leader) => {
        var hayAdmins = Object.filter(leader.listaUsers, isAdmin => true).length;
        if (!hayAdmins && Object.keys(leader.listaUsers).length > 0) {
            leader.listaUsers[Object.keys(leader.listaUsers)[0]].isActive = true;
            leader.listaUsers[Object.keys(leader.listaUsers)[0]].isAdmin = true;
            return leader.save();
        }
        if (!Object.keys(leader.listaUsers).length) return leader.remove();
        return leader;
    });
}


exports.createLeader = function (leaderData, username) {
    leaderData["listaUsers"] = {};
    var user = userModule.user.findOne({ username: username }).exec();

    return Promise.all([user]).then(([userR]) => {
        leaderData.listaUsers[username] = { username: userR.username, id: userR._id, isAdmin: true, isActive: true };
        if (!leaderData.password) delete leaderData.password;

        return local.leaderboard.count({ name: leaderData.name })
            .then((data) => {
                if (data === 0) return new local.leaderboard(leaderData).save();
                return Promise.reject({ errors: { name: "La quiniela ya existe" } });
            })
            .then((leader) => {
                groupsModel.service.createDefaulsGroupsPlayer(leader._id, userR._id, leader.type);
                return leader;
            });
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
