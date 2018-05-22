const request = require("request");
const userModule = require("./users");
const groupModule = require("./groups");
const teamModule = require("./teams");
const leadModule = require("./leaderboard");

teamModule.team.collection.drop();
userModule.user.collection.drop();
leadModule.leaderboard.collection.drop();
//userModule.user.collection.drop();
new userModule.user({ username: "Daniel", password: "123456" }).save();
new leadModule.leaderboard({
    name: "Daniel", password: "123456", listaUsuarios: [
        new leadModule.leaderboardPlayer({ username: "Daniel", isAdmin: true, isActive: true, winnerTeam: null, points: 0 })
    ]
}).save();

request('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json', function (error, response, body) {
    var Teams = JSON.parse(body).teams;
    var Groups = JSON.parse(body).groups;
    var knockouts = JSON.parse(body).knockout;
    var counter = 1;
    for (item in Teams) {
        new teamModule.team(Teams[item]).save();
    }
    for (item in Groups) {
        new groupModule.group({ ...Groups[item], shortName: Groups[item].name.replace("Group ", ""), type: "groups", order: counter }).save();
        counter = counter + 1;
    }
    for (item in knockouts) {
        new groupModule.group({ ...knockouts[item], shortName: knockouts[item].name, type: "knockouts", order: counter }).save();
        counter = counter + 1;
    }
});

