var mongoose = require('mongoose');
var sha1 = require('sha1');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String, unique: true, required: [true, 'Usuario requerido'], indexed: true,
        minlength: 6,
        maxlength: 12,
    },
    password: {
        required: "Contraseña requerida",
        type: String,
        minlength: 6,
        set: function (value) {
            if(value.length <6) return value;
            return sha1(value);
        }
    }
});

module.exports = mongoose.model('User', UserSchema);