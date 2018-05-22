const leaderboard = require("./leaderboardModel").LeaderBoard;
const leaderboardPlayer = require("./leaderboardModel").LeaderBoardPlayer;
const service = require("./leaderboardService")
const api = require("./leaderboardAPI")

module.exports.leaderboard = leaderboard;
module.exports.leaderboardPlayer = leaderboardPlayer;
module.exports.service = service;
module.exports.api = api;