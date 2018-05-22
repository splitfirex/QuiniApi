const local = require("./");

exports.getAllLeaders = function (username) {
    return local.leaderboard.find({}, { password: 0 }, { sort: { name: -1 }, }).exec();
};
