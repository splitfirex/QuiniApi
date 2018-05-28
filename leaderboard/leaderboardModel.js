'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sha1 = require('sha1');

exports.LeaderBoard = mongoose.model('LeaderBoard', new Schema({
    name: {
        type: String,
        required: 'El nombre de la quiniela siempre es unico',
        index: true,
        unique: true
    },
    type: String,
    bgColor: {
        type: String, set: function (value) {
            return "#" + value;
        }
    },
    password: {
        type: String,
        default: undefined,
        set: function (value) {
            if (value && value.length < 6) return value;
            return sha1(value);
        }
    },
    listaUsers: Schema.Types.Mixed
}));

exports.LeaderBoardPlayer = function (input) {
    this.username = input.username;
    if (input.id !== undefined) this.id = input.id;
    if (input.isAdmin !== undefined) this.isAdmin = input.isAdmin;
    if (input.isActive !== undefined) this.isActive = input.isActive;
    if (input.points !== undefined) this.points = input.points;
    if (input.winnerTeam !== undefined) this.winnerTeam = input.winnerTeam;
};