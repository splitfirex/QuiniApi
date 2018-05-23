const request = require("request");
const userModule = require("./users");
const groupModule = require("./groups");
const teamModule = require("./teams");
const leadModule = require("./leaderboard");

teamModule.team.collection.drop();
userModule.user.collection.drop();
leadModule.leaderboard.collection.drop();
//userModule.user.collection.drop();
var u = new userModule.user({ username: "Daniel", password: "123456" }).save();
var l = new leadModule.leaderboard({ name: "Daniel", password: "123456" }).save();
var l2 = new leadModule.leaderboard({ name: "Daniel2" }).save();

Promise.all([l,l2]).then(function ([ladderResult,ladderResult2]) {
    leadModule.service.joinLeader(ladderResult.name,"Daniel").then();
    leadModule.service.joinLeader(ladderResult2.name,"Daniel").then();
});
/*Promise.all([u, l]).then(function ([userResult, ladderResult]) {
    leadModule.leaderboard.findOneAndUpdate(ladderResult._id, {
        $push:
            { listaUsers: new leadModule.leaderboardPlayer({ username: userResult.username, isAdmin: true, isActive: true }) }
    }).exec()
        .then();
    return;
});
*/

new teamModule.team({ id: 1, name: "team1" }).save();

/*request('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json', function (error, response, body) {
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
});*/

