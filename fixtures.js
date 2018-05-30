require('dotenv').config({ path: './.env' });
var schedule = require('node-schedule');
const request = require("request");
const userModule = require("users");
const groupModule = require("groups");
const teamModule = require("teams");
const leadModule = require("leaderboard");
const fs = require("fs");

if (process.env.setTimer == "true") {
    var j = schedule.scheduleJob(process.env.shcedulerTimer, function () {
        groupModule.service.lockEdit();
        updateAllMatches();
    });
}
var updateAllMatches = function () {
    console.log("Actualizando valores desde disco");
    request('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json', function (err, response, body) {
        if (err) {
            return console.log(err);
        }
        if (err) return console.log(err);
        var Groups = JSON.parse(body).groups;
        var knockouts = JSON.parse(body).knockout;
        var counter = 1;
        for (item in Groups) {
            var matches = {}
            Groups[item].matches.forEach(element => {
                if (element.finished == "false") return;
                groupModule.service.updateMatchMain(
                    leadModule.genericleader,
                    userModule.genericuser, {
                        home_result: parseInt(element.home_result),
                        away_result: parseInt(element.away_result),
                        home_penalty: parseInt(element.home_penalty),
                        away_penalty: parseInt(element.away_penalty),
                        home_team: parseInt(element.home_team),
                        away_team: parseInt(element.away_team),
                        match: element.name
                    })
                    .catch((err) => { console.log(err) });
            });
        }
        for (item in knockouts) {
            var matches = {}
            knockouts[item].matches.forEach(element => {
                if (element.finished == "false") return;
                groupModule.service.updateMatchMain(
                    leadModule.genericleader,
                    userModule.genericuser, {
                        home_result: parseInt(element.home_result),
                        away_result: parseInt(element.away_result),
                        home_penalty: parseInt(element.home_penalty),
                        away_penalty: parseInt(element.away_penalty),
                        home_team: parseInt(element.home_team),
                        away_team: parseInt(element.away_team),
                        match: element.name
                    })
                    .catch((err) => { console.log(err) });
            });
        }
    });
}


if (process.env.CLEAN_ALL == "true") {
    leadModule.leaderboard.collection.drop();
    teamModule.team.collection.drop();
    userModule.user.collection.drop();
    groupModule.group.collection.drop();
}

if (process.env.reloadMain == "true") {
    var user1 = userModule.service.registerUser({ username: userModule.genericuser, password: userModule.genericpassword });
    Promise.all([user1]).then(() => {
        leadModule.service.createLeader({
            name: leadModule.genericleader, type: "P", bgColor: Math.floor((Math.random() * 256 * 256 * 256)).toString(16)
        }, userModule.genericuser)
            .catch((err) => console.log(err));
    }).catch((err) => console.log(err));
}

if (process.env.reloadDemo == "true") {
    var user3 = userModule.service.registerUser({ username: "Jugador2", password: "jugador2" });
    var user2 = userModule.service.registerUser({ username: "Jugador1", password: "jugador1" });
    Promise.all([user2]).then(() => {
        leadModule.service.createLeader({
            name: "DEMO", type: "P", bgColor: Math.floor((Math.random() * 256 * 256 * 256)).toString(16)
        }, "Jugador1").then((leader) => {
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
}

if (process.env.reloadFixtures) {
    if (process.env.reloadFromWeb == "true") {
        request('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json', function (error, response, body) {
            if (error) {
                return console.log(error);
            }
            if (error) return console.log(error);
            var Teams = JSON.parse(body).teams;
            var Groups = JSON.parse(body).groups;
            var knockouts = JSON.parse(body).knockout;
            var counter = 1;
            for (item in Teams) {
                teamModule.service.createTeam(Teams[item]);
            }
            for (item in Groups) {
                var matches = {}
                Groups[item].matches.forEach(element => {
                    matches[element.name + ""] = new groupModule.match(element);
                    matches[element.name + ""].groupName = Groups[item].name.replace("Group ", "");
                    matches[element.name + ""].editable = true;
                    matches[element.name + ""].forced = false;
                    matches[element.name + ""].playerPoint = null;
                });

                groupModule.service.createGroup({ ...Groups[item], matches: matches, shortName: Groups[item].name.replace("Group ", ""), type: "groups", order: counter });
                counter = counter + 1;
            }
            for (item in knockouts) {
                var matches = {}
                knockouts[item].matches.forEach(element => {
                    matches[element.name + ""] = new groupModule.match(element);
                    matches[element.name + ""].groupName = knockouts[item].name
                    matches[element.name + ""].editable = true;
                    matches[element.name + ""].forced = false;
                    matches[element.name + ""].playerPoint = null;
                });

                groupModule.service.createGroup({ ...knockouts[item], matches: matches, shortName: knockouts[item].name, type: "knockouts", order: counter });
                counter = counter + 1;
            }
        });
    } else {
        fs.readFile('data.json', 'utf8', function (err, body) {
            if (err) {
                return console.log(err);
            }
            if (err) return console.log(err);
            var Teams = JSON.parse(body).teams;
            var Groups = JSON.parse(body).groups;
            var knockouts = JSON.parse(body).knockout;
            var counter = 1;
            for (item in Teams) {
                teamModule.service.createTeam(Teams[item]);
            }
            for (item in Groups) {
                var matches = {}
                Groups[item].matches.forEach(element => {
                    matches[element.name + ""] = new groupModule.match(element);
                    matches[element.name + ""].groupName = Groups[item].name.replace("Group ", "");
                    matches[element.name + ""].editable = true;
                    matches[element.name + ""].forced = false;
                    matches[element.name + ""].playerPoint = null;
                });

                groupModule.service.createGroup({ ...Groups[item], matches: matches, shortName: Groups[item].name.replace("Group ", ""), type: "groups", order: counter });
                counter = counter + 1;
            }
            for (item in knockouts) {
                var matches = {}
                knockouts[item].matches.forEach(element => {
                    matches[element.name + ""] = new groupModule.match(element);
                    matches[element.name + ""].groupName = knockouts[item].name
                    matches[element.name + ""].editable = true;
                    matches[element.name + ""].forced = false;
                    matches[element.name + ""].playerPoint = null;
                });

                groupModule.service.createGroup({ ...knockouts[item], matches: matches, shortName: knockouts[item].name, type: "knockouts", order: counter });
                counter = counter + 1;
            }
        });
    }
}