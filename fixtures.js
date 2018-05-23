const request = require("request");
const userModule = require("./users");
const groupModule = require("./groups");
const teamModule = require("./teams");
const leadModule = require("./leaderboard");

teamModule.team.collection.drop();
userModule.user.collection.drop();
leadModule.leaderboard.collection.drop();
groupModule.group.collection.drop();

userModule.service.registerUser({ username: "Daniel", password: "123456" });
leadModule.service.createLeader({ name: "Daniel2", listaUsers:[{ username: "Daniel", isAdmin: true, isActive: true }]});


request('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json', function (error, response, body) {
    var Teams = JSON.parse(body).teams;
    var Groups = JSON.parse(body).groups;
    var knockouts = JSON.parse(body).knockout;
    var counter = 1;
    for (item in Teams) {
        teamModule.service.createTeam(Teams[item]);
    }
    for (item in Groups) {
        groupModule.service.createGroup({ ...Groups[item], shortName: Groups[item].name.replace("Group ", ""), type: "groups", order: counter });
        counter = counter + 1;
    }
    for (item in knockouts) {
        groupModule.service.createGroup({ ...knockouts[item], shortName: knockouts[item].name, type: "knockouts", order: counter });
        counter = counter + 1;
    }
});

