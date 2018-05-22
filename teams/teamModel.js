var mongoose = require('mongoose');
var sha1 = require('sha1');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    "id": { unique: true, index: true, type: Number },
    "name": { unique: true, type: String },
    "fifaCode": String,
    "iso2": String,
    "flag": String,
    "emoji": String,
    "emojiString": String
});

module.exports = mongoose.model('Team', TeamSchema);