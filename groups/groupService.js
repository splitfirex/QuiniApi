const local = require("./");

exports.createGroup = function (groupData) {
    local.group.find({ idLeaderboard: groupData.idLeaderboard, idUser: groupData.idUser, order: groupData.order }, function (data) {
        if (!data) new local.group(groupData).save();
    }).catch((err) => console.log(err));
};
