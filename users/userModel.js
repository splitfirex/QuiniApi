var mongoose = require('mongoose');
var sha1 = require('sha1');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, unique: true, required : true, indexed: true },
    password: {
        required : true,
        type: String,
        set: function(value){
            return sha1(value);
        }
    }
});

module.exports = mongoose.model('User', UserSchema);