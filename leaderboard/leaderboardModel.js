'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.LeaderBoard = mongoose.model('LeaderBoard',new Schema({
    name: {
        type: String,
        required: 'El nombre de la quiniela siempre es unico',
        index: true,
        unique: true
    },
    type: String,
    bgColor: String,
    listaUsuarios: [Schema.Types.Mixed],
    password: String
}));

exports.LeaderBoardPlayer = function(input){
    this.username = input.username;
    if(input.isAdmin != null) this.isAdmin = input.isAdmin;
    if(input.isActive != null)this.isActive = input.isActive;
    if(input.points != null)this.points = input.points;
    if(input.winnerTeam != null)this.winnerTeam = input.winnerTeam;
};