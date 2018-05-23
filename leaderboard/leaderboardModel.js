'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.LeaderBoard = mongoose.model('LeaderBoard', new Schema({
    name: {
        type: String,
        required: 'El nombre de la quiniela siempre es unico',
        index: true,
        unique: true
    },
    type: String,
    bgColor: String,
    password: String,
    listaUsers: [Schema.Types.Mixed] 
}));

exports.LeaderBoardPlayer = function(input){
    this.username = input.username;
    this.isAdmin  = input.isAdmin  || undefined;
    this.isActive  = input.isActive  || undefined;
    this.points  = input.points  || undefined;
    this.winnerTeam = input.winnerTeam || undefined;
};