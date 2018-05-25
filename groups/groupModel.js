'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.group = mongoose.model('Group', new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    shortName: String,
    idUser: String,
    idLeaderboard: String,
    winnerup: Number,
    runnerup: Number,
    matches: Schema.Types.Mixed,
    order: Number
}))

exports.match = function (input) {
    this.name = input.name;
    this.type = input.type;
    switch (this.type) {
        case "qualified":
            this.home_team_ph = input.home_team.replace("winner_","").toUpperCase()+"_1";
            this.away_team_ph = input.away_team.replace("runner_","").toUpperCase()+"_2";
            this.home_team = null;
            this.away_team = null;
            break;
        case "winner":
            this.home_team_ph = "W" + input.home_team;
            this.away_team_ph = "W" + input.away_team;
            this.home_team = null;
            this.away_team = null;
            break;
        case "loser":
            this.home_team_ph = "L" + input.home_team;
            this.away_team_ph = "L" + input.away_team;
            this.home_team = null;
            this.away_team = null;
            break;
        default:
            this.winner = input.winner || undefined;
            this.runnerup = input.runnerup || undefined;
            this.home_team = input.home_team;
            this.away_team = input.away_team;
    }
    this.home_result = input.home_result != 'null' && input.home_result;
    this.away_result = input.away_result != 'null' && input.home_result;
    this.home_penalty = input.home_penalty != 'null' && input.home_penalty;
    this.away_penalty = input.away_penalty != 'null' && input.away_penalty;
    this.date = new Date(input.date).getTime();
    this.playerScore = -1;
    this.finished = input.finished;
};