'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    shortName:String,
    idUser: String,
    idLeaderboard: String,
    winnerup: Number,
    runnerup: Number,
    matches: [Schema.Types.Mixed],
    order: Number
});

module.exports = mongoose.model('Group', GroupSchema);